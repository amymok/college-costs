import os
import json
import uuid
import re

try:
    from collections import OrderedDict
except:  # pragma: no cover
    from ordereddict import OrderedDict

import requests

from django.utils import timezone
from django.middleware import csrf
from django.core.urlresolvers import reverse
from django.views.generic import View, TemplateView
from django.shortcuts import get_object_or_404, render_to_response
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.template import RequestContext
from django.template.loader import get_template
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings

from haystack.query import SearchQuerySet

from models import School, Worksheet, Feedback, Notification
from models import Program, ConstantCap, ConstantRate
from validators import validate_uuid4  # ,validate_worksheet
from paying_for_college.disclosures.scripts import nat_stats

# from models import BAHRate
from forms import FeedbackForm, EmailForm
BASEDIR = os.path.dirname(__file__)

try:
    STANDALONE = settings.STANDALONE
except:  # pragma: no cover
    STANDALONE = False

if STANDALONE:
    BASE_TEMPLATE = "standalone/base_update.html"
else:  # pragma: no cover
    BASE_TEMPLATE = "front/base_update.html"

URL_ROOT = 'paying-for-college2'


REGION_MAP = {'MW': ['IL', 'IN', 'IA', 'KS', 'MI', 'MN',
                     'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
              'NE': ['CT', 'ME', 'MA', 'NH', 'NJ',
                     'NY', 'PA', 'RI', 'VT'],
              'SO': ['AL', 'AR', 'DE', 'DC', 'FL', 'GA', 'KY', 'LA', 'MD',
                     'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'],
              'WE': ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'NM',
                     'OR', 'UT', 'WA', 'WY']
              }
REGION_NAMES = {'MW': 'Midwest',
                'NE': "Northeast",
                'SO': 'South',
                'WE': 'West'}


def validate_oid(oid):
    """
    make sure an oid contains only hex values 0-9 a-f A-F
    return True if the oid is valid
    """
    find_illegal = re.search('[^0-9a-fA-F]+', oid)
    if find_illegal:
        return False
    else:
        return True


def get_region(school):
    """return a school's region based on state"""
    for region in REGION_MAP:
        if school.state in REGION_MAP[region]:
            return region
    return ''


def get_program_length(program, school):
    if program and program.level:
        LEVEL = program.level
    elif school and school.degrees_predominant:
        LEVEL = school.degrees_predominant
    elif school and school.degrees_highest:
        LEVEL = school.degrees_highest
    else:
        return None
    if LEVEL in ['0', '1', '2']:
            return 2
    elif LEVEL in ['3', '4']:
        return 4
    else:
        return None


def get_school(schoolID):
    """Try to get a school by ID; return either school or empty string"""
    try:
        school = School.objects.get(school_id=int(schoolID))
    except:
        return ''
    else:
        return school


def get_program(school, programCode):
    """Try to get latest program; return either program or empty string"""
    programs = Program.objects.filter(program_code=programCode,
                                         institution=school).order_by('-pk')
    if programs:
        return programs[0]
    else:
        return ''


class BaseTemplateView(TemplateView):

    def get_context_data(self, **kwargs):
        context = super(BaseTemplateView, self).get_context_data(**kwargs)
        context['base_template'] = BASE_TEMPLATE
        context['url_root'] = URL_ROOT
        return context


class OfferView(TemplateView):  # TODO log errors
    """consult values in querystring and deliver school/program data"""

    def get(self, request):
        if 'iped' in request.GET and request.GET['iped']:
            iped = request.GET['iped']
            school = get_school(iped)
            if not school or not school.operating:
                error = "No active school could be found for iped ID {0}".format(iped)
                return HttpResponseBadRequest(error)
            if 'oid' in request.GET:
                OID = request.GET['oid']
            else:
                OID = ''
            if OID and validate_oid(OID) is False:
                return HttpResponseBadRequest("Offer ID has illegal characters;\
                    only 0-9 and a-f are allowed.")
            program_data = json.dumps({})
            program = ''
            if 'pid' in request.GET and request.GET['pid']:
                program_code = request.GET['pid']
                programs = Program.objects.filter(program_code=request.GET['pid'],
                                                     institution=school).order_by('-pk')
                if programs:
                    program = programs[0]
                    program_data = program.as_json()
            national_stats = nat_stats.get_prepped_stats(program_length=get_program_length(program, school))
            BLS_stats = nat_stats.get_bls_stats()
            if BLS_stats:
                categories = BLS_stats.keys()
                categories.remove('Year')
                if get_region(school):
                    region = get_region(school)
                    national_stats['region'] = REGION_NAMES[region]
                    for category in categories:
                        national_stats['regional{0}'.format(category)] = BLS_stats[category][region]
                else:
                    national_stats['region'] = "Not available"
                    for category in categories:
                        national_stats['national{0}'.format(category)] = BLS_stats[category]["average_annual"]


            return render_to_response('worksheet.html',
                                      {'data_js': "0",
                                       'school': school,
                                       'schoolData': school.as_json(),
                                       'program': program,
                                       'programData': program_data,
                                       'nationalData': json.dumps(national_stats),
                                       'oid': OID,
                                       'base_template': BASE_TEMPLATE,
                                       'url_root': URL_ROOT},
                                      context_instance=RequestContext(request))
        else:
            return HttpResponseBadRequest("URL doesn't contain a school ID")


class LandingView(TemplateView):
    template_name = "landing.html"

    def get_context_data(self, **kwargs):
        context = super(LandingView, self).get_context_data(**kwargs)
        context['base_template'] = BASE_TEMPLATE
        context['url_root'] = URL_ROOT
        return context


class FeedbackView(TemplateView):
    template_name = "feedback.html"

    @property
    def form(self):
        if self.request.method == 'GET':
            return FeedbackForm()

        elif self.request.method == 'POST':
            return FeedbackForm(self.request.POST)

    def get_context_data(self):
        cdict = dict(form=self.form)
        cdict['base_template'] = BASE_TEMPLATE
        cdict['url_root'] = URL_ROOT
        return cdict

    def post(self, request):
        form = self.form
        if form.is_valid():
            feedback = Feedback(message=form.cleaned_data['message'][:2000])
            feedback.save()
            return render_to_response("feedback_thanks.html",
                                      locals(),
                                      context_instance=RequestContext(request))
        else:
            return HttpResponseBadRequest("Invalid form")


class BuildComparisonView(View):

    def get(self, request):
        return render_to_response('worksheet.html',
                                  {'data_js': "0",
                                   'base_template': BASE_TEMPLATE,
                                   'url_root': URL_ROOT},
                                  context_instance=RequestContext(request))

    # def post(self, request):
    #     """extract id's and in-state information"""
    #     index = 1
    #     schools = {}
    #     data = {
    #         "global": {
    #             "aaprgmlength": 2,
    #             "yrincollege": 1,
    #             "gradprgmlength": 2,
    #             "familyincome": 48,
    #             "vet": False,
    #             "serving": "no",
    #             "tier": 100,
    #             "program": request.POST.get('school-program', 'ba')
    #             },
    #         "schools": {}
    #     }

    #     for school_id in [value for key, value
    #                       in request.POST.iteritems()
    #                       if key.endswith('-unitid')] + [100000, 100001]:
    #         if school_id:
    #             institution = School.objects.get(pk=int(school_id))
    #             in_state = request.POST.get('school-state-%s' % index, 'in')
    #             field_dict = serializers.serialize(
    #                 "python", [institution])[0]['fields']
    #             field_dict["institutionname"] = unicode(
    #                 institution.primary_alias)
    #             field_dict['instate'] = True if in_state == 'in' else False
    #             field_dict['color'] = False
    #             field_dict['fouryruniv'] = field_dict['four_year']
    #             field_dict.update({"color": False,
    #                                "oncampus": True,
    #                                "tuitionfees": 0,
    #                                "roombrd": 0,
    #                                "books": 0,
    #                                "personal": 0,

    #                                "pell": 0,
    #                                "scholar": 0,
    #                                "tuitionassist": 0,
    #                                "gibill": 0,
    #                                "perkins": 0,
    #                                "staffsubsidized": 0,
    #                                "staffunsubsidized": 0,
    #                                "gradplus": 0,

    #                                "savings": 0,
    #                                "family": 0,
    #                                "state529plan": 0,
    #                                "workstudy": 0,

    #                                "privateloan": 0,
    #                                "institutionalloan": 0,
    #                                "parentplus": 0,
    #                                "homeequity": 0,
    #                                "order": index - 1})

    #             csrf.get_token(request)
    #             data['schools'][str(school_id)] = field_dict
    #             index += 1

    #     data_js = json.dumps(data)
    #     csrf.get_token(request)
    #     return render_to_response('worksheet.html',
    #                               locals(),
    #                               context_instance=RequestContext(request))


class SchoolRepresentation(View):

    def get_school(self, school_id):
        return get_object_or_404(School, pk=school_id)

    def get(self, request, school_id, **kwargs):
        school = self.get_school(school_id)
        return HttpResponse(school.as_json(), content_type='application/json')


class ProgramRepresentation(View):

    def get_program(self, program_code):
        ids = program_code.split('_')
        return get_object_or_404(Program, institution__school_id=int(ids[0]), program_code=ids[1])

    def get(self, request, program_code, **kwargs):
        program = self.get_program(program_code)
        return HttpResponse(program.as_json(),
                            content_type='application/json')


class StatsRepresentation(View):

    def get_stats(self, school, programID):
        program = get_program(school, programID)
        national_stats = nat_stats.get_prepped_stats(program_length=get_program_length(program, school))
        BLS_stats = nat_stats.get_bls_stats()
        if BLS_stats:
            categories = BLS_stats.keys()
            categories.remove('Year')
            if get_region(school):
                region = get_region(school)
                national_stats['region'] = REGION_NAMES[region]
                for category in categories:
                    national_stats['regional{0}'.format(category)] = BLS_stats[category][region]
            else:
                national_stats['region'] = "Not available"
                for category in categories:
                    national_stats['national{0}'.format(category)] = BLS_stats[category]["average_annual"]
        return json.dumps(national_stats)

    def get(self, request, id_pair):
        school_id = id_pair.split('_')[0]
        school = get_school(school_id)
        if not school:
            error = "No school could be found for iped ID {0}".format(school_id)
            return HttpResponseBadRequest(error)
        try:
            program_id = id_pair.split('_')[1]
        except:
            program_id = ''
        stats = self.get_stats(school, program_id)
        return HttpResponse(stats, content_type='application/json')


class ConstantsRepresentation(View):

    def get_constants(self):
        constants = OrderedDict()
        for ccap in ConstantCap.objects.order_by('slug'):
            constants[ccap.slug] = ccap.value
        for crate in ConstantRate.objects.order_by('slug'):
            constants[crate.slug] = "{0}".format(crate.value)
        return json.dumps(constants)

    def get(self, request):
        return HttpResponse(self.get_constants(),
                            content_type='application/json')


class EmailLink(View):
    def post(self, request):
        form = EmailForm(request.POST)
        if form.is_valid():

            worksheet_guid = form.cleaned_data['id']
            worksheet = Worksheet.objects.get(guid=worksheet_guid)
            recipient = form.cleaned_data['email']
            subject = "Your Personalized College Financial Aid Information"
            body_template = get_template('email_body.txt')
            body = body_template.render(RequestContext(request,
                                        dict(guid=worksheet.guid)))

            send_mail(subject, body, 'no-reply@cfpb.gov', [recipient],
                      fail_silently=False)
        document = {'status': 'ok'}
        return HttpResponse(json.dumps(document),
                            content_type='application/json')

# # SAVING WORKSHEETS HAS BEEN REMOVED FROM PROJECT REQUIREMENTS

# class CreateWorksheetView(View):
#     def post(self, request):
#         worksheet_guid = str(uuid.uuid4())
#         worksheet = Worksheet(guid=worksheet_guid,
#                               saved_data=json.dumps({'id': worksheet_guid})
#                               )
#         worksheet.save()
#         response = HttpResponse(worksheet.saved_data, status=201)
#         return response


# class DataStorageView(View):
#     def post(self, request, guid):
#         if validate_uuid4(guid) == None:  # we have a valid uuid
#             worksheet = Worksheet.objects.get(guid=guid)
#         if worksheet and request.body:
#             validated_json = validate_worksheet(request.body)
#             if validated_json:
#                 worksheet.saved_data = validated_json
#                 worksheet.save()
#         return HttpResponse(worksheet.saved_data)


# def bah_lookup_api(request):
#     zip5 = request.GET.get('zip5')
#     try:
#         rate = BAHRate.objects.filter(zip5=zip5).get()
#         document = {'rate': rate.value}
#         document_as_json = json.dumps(document)
#     except:
#         document_as_json = json.dumps({})
#     return HttpResponse(document_as_json,
#                         content_type='application/javascript')


def school_search_api(request):
    sqs = SearchQuerySet().models(School)
    sqs = sqs.autocomplete(autocomplete=request.GET.get('q', ''))

    document = [{'schoolname': school.text,
                 'id': school.school_id,
                 'city': school.city,
                 'state': school.state,
                 'url': reverse('disclosures:school-json',
                                args=[school.school_id])}
                for school in sqs]
    json_doc = json.dumps(document)

    return HttpResponse(json_doc, content_type='application/json')


class VerifyView(View):
    def post(self, request):
        data = request.POST
        timestamp = timezone.now()
        if 'iped' in data and data['iped']:
            school = School.objects.get(school_id=int(data['iped']))
            notification = Notification.objects.create(institution=school,
                                                       oid=data['oid'],
                                                       timestamp=timestamp,
                                                       errors=data['errors'][:255])
            msg = notification.notify_school()
            callback = json.dumps({'result': "verification recorded; {0}".format(msg)})
        else:
            return HttpResponseBadRequest("No valid school ID found; postdata is {0}".format(request.POST))

        response = HttpResponse(callback)
        return response

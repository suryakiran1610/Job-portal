from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q


from .models import jobpost
from .models import jobcategories
from .models import Company
from .models import CompanySector
from .models import CompanyDepartment
from .models import Department
from .models import CompanyEmployee
from authentication.models import user
from jobseeker.models import applyjob
from adminn.models import notification
from authentication.serializers import userserializer
from jobseeker.serializers import applyjobserializer
from adminn.serializers import notificationserializer
from .serializers import jobpostserializer
from .serializers import jobcategoriesserializer
from .serializers import CompanySerializer
from .serializers import DepartmentSerializer
from .serializers import CompanyDepartmentSerializer
from .serializers import CompanySectorSerializer
from .serializers import CompanyEmployeeSerializer


class CompanyPersonalInfo(APIView):
    def post(self, request):
        user_id = int(request.query_params.get('user_id'))
        try:
            company = Company.objects.get(company_user_id=user_id)
            serializer = CompanySerializer(company, data=request.data)
        except Company.DoesNotExist:
            serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class Companyemployee(APIView):

    def post(self, request):
        user_id = int(request.query_params.get('user_id'))
        data = request.data
        data["company_user_id"] = user_id
        serializer = CompanyEmployeeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user_id = int(request.query_params.get('user_id'))
        company_employees = CompanyEmployee.objects.filter(
            company_user_id=user_id
        )
        serializer = CompanyEmployeeSerializer(company_employees, many=True)
        return Response(serializer.data)



class AddNewDepartment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.data.get("user_id")
        sectors = request.data.get("sectors", [])
        departments = request.data.get("departments", [])

        added_departments = []

        for sector_name in sectors:
            sector, _ = CompanySector.objects.get_or_create(sector_name=sector_name)

        for department_data in departments:
            sector_name = department_data.get("sector_name")
            department_name = department_data.get("department_name")

            sector, _ = CompanySector.objects.get_or_create(sector_name=sector_name)
            department, created = CompanyDepartment.objects.get_or_create(
                sector=sector,
                department_name=department_name,
                companyid=user_id
            )
            if created:
                added_departments.append({
                    "sector_name": sector_name,
                    "department_name": department_name
                })

        return Response(
            added_departments,
            status=status.HTTP_200_OK,
        )

    
class GetCompanydepartment(APIView):
    def get(self,request):
        user_id = int(request.query_params.get('user_id'))
        depts=CompanyDepartment.objects.filter(companyid=user_id)
        serializer=CompanyDepartmentSerializer(depts,many=True)
        return Response(serializer.data)

    def delete(self, request):
        sector_name = request.query_params.get('sector_name')
        user_id = request.query_params.get('user_id')

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sector = CompanySector.objects.get(sector_name=sector_name)
            CompanyDepartment.objects.filter(companyid=user_id, sector=sector).delete()
            sector.delete()
        except CompanySector.DoesNotExist:
            return Response({'error': 'Sector not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)


class GetCompanysector(APIView):
    def get(self,request):
        sector=CompanySector.objects.filter(is_verified=1)
        serializer=CompanySectorSerializer(sector,many=True)
        return Response(serializer.data)

class GetDepartments(APIView):
    def get(self,request):
        dept=Department.objects.all()
        serializer=DepartmentSerializer(dept,many=True)
        return Response(serializer.data)



class UpdateSectorAndDepartments(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        Companyname = request.data.get("companyname")
        sectors = request.data.get("sectors", [])
        departments = request.data.get("departments", [])

        try:
            User = Company.objects.get(company_user_id=user_id)
        except user.DoesNotExist:
            return Response("User not found.", status=status.HTTP_404_NOT_FOUND)

        new_sectors = []

        for sector_name in sectors:
            sector,created = CompanySector.objects.get_or_create(sector_name=sector_name)
            if created:
                new_sectors.append((sector.id, sector_name))

        for department_data in departments:
            sector_name = department_data.get("sector_name")
            department_name = department_data.get("department_name")

            sector, _ = CompanySector.objects.get_or_create(sector_name=sector_name)
            department, _ = CompanyDepartment.objects.get_or_create(
                sector=sector,
                department_name=department_name,
                companyid=user_id
            )

        notification.objects.create(
            message="New Company Registered",
            companyname=User.company_name,
            companyid=user_id,
            notificationtype="registration"
        )

        for sector_id, sector_name in new_sectors:
            notification.objects.create(
                message=f"New Sector Created: {sector_name}",
                companyid=user_id,
                companyname=Companyname,
                notificationtype="sector_created",
                jobcategoryid=sector_id
            )

        return Response(
            f"Sectors and departments updated for user ID {user_id}.",
            status=status.HTTP_200_OK,
        )  



class DeleteDepartment(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        sectorname = request.data.get("sector_name")
        departmentname = request.data.get("department_name")
        user_id = request.data.get("user_id")

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sector = CompanySector.objects.get(sector_name=sectorname)
            CompanyDepartment.objects.filter(companyid=user_id, sector=sector, department_name=departmentname).delete()
        except CompanySector.DoesNotExist:
            return Response({'error': 'Sector not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)




class CompanydepartmentView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user_id = int(request.query_params.get('user_id'))
        depts=CompanyDepartment.objects.filter(companyid=user_id)
        serializer=CompanyDepartmentSerializer(depts,many=True)
        return Response(serializer.data)       


class Jobcategory(APIView):

    def get(self,request):
        category=jobcategories.objects.filter(isapproved=1)
        serializer=jobcategoriesserializer(category,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        Companyname = request.query_params.get('companyname')
        Companyid = int(request.query_params.get('companyid'))
        data = request.data.copy()
        data['isapproved'] = False
        serializer=jobcategoriesserializer(data=data)
        if serializer.is_valid():
            serializer.save()

            jobcategory = serializer.data.get('jobcategory')
            id=serializer.data.get('id')

            notification.objects.create(
                message=f"New Job Category Added: {jobcategory}",
                companyname=Companyname,
                companyid=Companyid,
                notificationtype="add_jobcategory_request",
                jobcategoryid=id

            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyprofileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = int(request.query_params.get('user_id'))
        print("Logged-in user's id:", user_id)
        try:
            company = Company.objects.get(company_user_id=user_id)
            serializer = CompanySerializer(company)
            data = serializer.data
            return Response(data)
        except Company.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)  

    def put(self, request):
        print(request.data)  # Log the request data
        user_id = int(request.query_params.get('user_id'))
        try:
            editprofile = Company.objects.get(company_user_id=user_id)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(editprofile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)  # Log the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      



class PostJob(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer=jobpostserializer(data=request.data)
        if serializer.is_valid():
            serializer.save(company_user_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        id=int(request.query_params.get('user_id'))

        jobs =jobpost.objects.filter(company_user_id=id)
        jobs=jobs[start_index:start_index+limit]

        serializer=jobpostserializer(jobs,many=True)
        return Response(serializer.data)
    
    def put(self,request):
        print(request.data)
        jobid=int(request.query_params.get('job_id'))
        editjob = jobpost.objects.get(id=jobid)

        serializer =jobpostserializer(editjob,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ViewJob(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        print(request.data)
        jobid=int(request.query_params.get('jobid'))
        job=jobpost.objects.get(id=jobid)

        if job:
            serializer=jobpostserializer(job)
            return Response(serializer.data)
        else:
            return Response({'error': 'Job not found'}, status=404)

    def delete(self, request):
        print(request.data)
        jobid = int(request.query_params.get('jobid'))
        try:
            job = jobpost.objects.get(id=jobid)
        except jobpost.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class Users(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self,request):
        print(request.data)
        userid=int(request.query_params.get('userid'))
        usr=user.objects.get(id=userid)

        if usr:
            serializer=userserializer(usr)
            return Response(serializer.data)
        else:
            return Response({'error': 'Job not found'}, status=404)
        
    def put(self, request):
        print(request.data)  # Log the request data
        userid = int(request.query_params.get('userid'))
        try:
            editprofile = user.objects.get(id=userid)
        except user.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = userserializer(editprofile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)  # Log the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordChange(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        print(request.data)
        userid = int(request.query_params.get('userid'))
        
        try:
            usr = user.objects.get(id=userid)
        except user.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        old_password = request.data.get('oldpassword')
        new_password = request.data.get('newpassword')
        confirm_password = request.data.get('confirmpassword')

        if not usr.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New password and confirm password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        usr.set_password(new_password)
        usr.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

class FilterApplicants(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        id=int(request.query_params.get('job_id'))

        applicants =applyjob.objects.filter(job_id=id)
        applicants=applicants[start_index:start_index+limit]

        serializer=applyjobserializer(applicants,many=True)
        return Response(serializer.data)    

class AllApplicants(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self,request):
        applicants =applyjob.objects.all()
        serializer=applyjobserializer(applicants,many=True)
        return Response(serializer.data)    


class GetallPostedJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id=int(request.query_params.get('user_id'))
        limit = int(request.query_params.get('limit', 6))
        start_index = int(request.query_params.get('startIndex', 0))
        keywords = request.query_params.get('keywords', '').strip()
        location = request.query_params.get('location', '').strip()

        filters = Q()
        if keywords:
            filters &= (
                Q(jobtitle__icontains=keywords) |
                Q(companyname__icontains=keywords) |
                Q(jobkeywords__icontains=keywords)
            )

        if location:
            filters &= (
                Q(joblocation__icontains=location) |
                Q(joblocationstate__icontains=location)
            )

        jobs = jobpost.objects.filter(filters,company_user_id=id).order_by('-jobposteddate')[start_index:start_index + limit]
        serializer = jobpostserializer(jobs, many=True)
        return Response(serializer.data)

class AddSectorDepartments(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        sectors = request.data.get("sectors", [])
        departments = request.data.get("departments", [])

        for sector_data in sectors:
            sector_name = sector_data.get("sector_name")
            sector = CompanySector.objects.create(sector_name=sector_name,is_verified=1)

        for department_data in departments:
            department_name = department_data.get("department_name")
            department=Department.objects.create(name=department_name)

        return Response(
            f"Sectors and departments updated for user ID {user_id}.",
            status=status.HTTP_200_OK,
        )  








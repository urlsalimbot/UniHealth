# UNIHEALTH

Integrated Municipal Health Information And Service Delivery System: 
A Unified Digital Platform For 
Hospitals, 
Rural Health Units, And 
Citizen Access

## How to install and run

1. git clone -S https://www.github.com/urlsalimbot/unihealth

2. cd unihealth

3. php composer install
   npm install

4. php artisan key:generate

5. composer run dev

## to-do list

- [x] patient dashboard

- [ ] patient polish input

- [x] patient recorded vs nominal value charts
- [x] patient historical chief complaints
- [x] patient current prescribed medication
- [x] patient most recent medical intervention

- [x] polish encounters panel
- [x] add medical encounters intake
- [x] add vital signs intake <!--test-->
- [x] add prescriptions intake <!--test-->

- [x] add file attachments

- [ ] inventory dashboard
- [x] stocks quantity modification
- [x] inside medication interface
- [x] input medication interface
- [x] view medication
- [ ] edit medication button <!--implement-->
- [ ] recall stocks button <!--implement-->
- [x] stocks low quantity alert
- [ ] release table for transaction auditing <!--implement-->

- [ ] staff dashboard finalization <!--polish-->
- [x] radial chart of visits in the last 7 days
- [x] stock monitoring and updates
- [x] heatmap of encounters
- [x] patients triage urgency

- [x] only admin can create and authorize staff accounts
- [ ] send temporary passwords to email add <!--implement-->

- [x] split staff/user roles further into patient, doctor, intake, pharmacist 
- [x] send out patient intake form to a guest through UHID 

- [ ] data integrity <!--complete below-->
- [x] notifications for actions
- [x] audit tracing for admin accounts
- [x] update all controllers to include proper logging <!--test-->

- [ ] one source of truth
- [x] patient facing interface
- [x] show only patients tab and inventory tab
- [x] patients tab view-only
- [ ] inventory view-only <!--test-->

- [ ] migrate to mysql

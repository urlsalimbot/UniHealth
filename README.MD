# UNIHEALTH
## Integrated Municipal Health Information And Service Delivery System: A Unified Digital Platform For Hospitals, Rural Health Units, And Citizen Access

### How to install and run 
1. git clone -S https://www.github.com/urlsalimbot/unihealth

2. cd unihealth

3. php composer install
4. npm install

5. php artisan key:generate

6. composer run dev


## to-do list

- [ ] data integrity
- [x] notifications for actions
- [x] audit tracing for admin accounts
- [ ] update all controllers to include proper logging

- [ ] patient dashboard
- [ ] patient polish input 
- [ ] patient recorded vs nominal value charts
- [ ] patient historical chief complaints
- [ ] patient current prescribed medication
- [ ] patient most recent medical intervention

- [ ] inventory dashboard
- [ ] stocks quantity modification
- [ ] stocks low quantity alert
- [ ] inside medication interface 
- [ ] input medication interface
- [ ] view and edit medication

- [ ] staff dashboard finalization
- [ ] radial chart of visits in the last 7 days
- [ ] stock monitoring and updates
- [ ] heatmap of encounters
- [ ] patients triage urgency

- [ ] patient facing interface
- [ ] show only patients tab and inventory tab
- [ ] patients tab view-only
- [ ] inventory view-only

- [ ] migrate to mysql
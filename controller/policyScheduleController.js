/**
 * Created by Sinner on 08-08-2017.
 */
var app = angular.module("policySchedularApp", []);

app.controller("policyScheduleController", function($timeout,$scope, $http){

    $scope.policyName='';
    $scope.policyDesc='';
    $scope.policyTag='';

// check box variable for toggle
    $scope.hourly=false;
    $scope.daily=false;
    $scope.weekly=false;
    $scope.monthly=false;
    $scope.yearly=false;

//select dropdown model arrays
    $scope.months_list = months_list;
    $scope.month_day_type_list = month_day_type_list;
    $scope.week_days_list = week_days_list;
    $scope.retention_period_list = retention_period_list;        

//model variable for hourly
    $scope.hourly_every_hour = 1;
    $scope.hourly_starts_hour = 12;
    $scope.hourly_starts_min = 0;
    $scope.hourly_radio = "hourly_every";
    $scope.hourly_retention_period = 0;
    $scope.hourly_retention = $scope.retention_period_list[0];
    //cron model variable
    $scope.hourly_cron="";

//model variable for daily
    $scope.daily_every_day = 1;
    $scope.daily_radio = "daily_every";
    $scope.daily_starts_hour = 12;
    $scope.daily_starts_min = 0;
    $scope.daily_retention_period = 0;
    $scope.daily_retention = $scope.retention_period_list[0];
    //cron model variable
    $scope.daily_cron="as";

//model variable for weekly
    $scope.weekly_starts_hour = 12;
    $scope.weekly_starts_min = 0;
    $scope.selectedDays = new Array(7);    
    $scope.weekly_retention_period = 0;
    $scope.weekly_retention = $scope.retention_period_list[0];
    //cron model variable
    $scope.weekly_cron="";

//model variable for monthly
    $scope.monthly_the_week_day = $scope.week_days_list[0];
    $scope.monthly_the_mon_day = $scope.month_day_type_list[0];
    $scope.monthly_day = 1;
    $scope.monthly_month = 1;
    $scope.monthly_every_month = 1;
    $scope.monthly_starts_hour = 12;
    $scope.monthly_starts_min = 0;
    $scope.monthly_radio = "monthly_radio_day"
    $scope.monthly_retention_period = 0;
    $scope.monthly_retention = $scope.retention_period_list[0];
    //cron model variable
    $scope.monthly_cron="";

//model variable for yearly
    $scope.yearly_every_year = 1;
    $scope.yearly_the_mon_day = $scope.month_day_type_list[0];
    $scope.yearly_the_week_day = $scope.week_days_list[0];
    $scope.yearly_the_year = 1;
    $scope.yearly_every_day = 1;
    $scope.yearly_starts_hour = 12;
    $scope.yearly_starts_min = 0;
    $scope.yearly_radio = "yearly_radio_every";
    $scope.yearly_retention_period = 0;
    $scope.yearly_retention = $scope.retention_period_list[0];
    //cron model variable
    $scope.yearly_cron="";


    $scope.policy = {};

    // function to toggle checkbox div
    $scope.toggleDiv = function (crontype) {        
        $scope[crontype] = !$scope[crontype];       
    }    

    //function to generate json
    $scope.generateJSON = function(){
        
        $scope.policy.name = $scope.policyName;
        $scope.policy.description =$scope.policyDesc;
        $scope.policy.tags = $scope.policyTag;
        $scope.policy.scheduleExpressions = [];

        if($scope.hourly == true){
            var scheduleExp = {};
            scheduleExp.name = "hourly";
            scheduleExp.schedule = "cron("+$scope.hourly_cron+")";
            scheduleExp.retentionUnit = $scope.hourly_retention;
            scheduleExp.retentionValue = $scope.hourly_retention_period;

            $scope.policy.scheduleExpressions.push(scheduleExp)

        }

        if($scope.daily == true){
            var scheduleExp = {};
            scheduleExp.name = "daily";
            if($scope.daily_radio == "daily_every"){
                var pos = $scope.daily_cron.lastIndexOf("/");
                $scope.daily_cron = $scope.daily_cron.substr(0,pos)+"/"+$scope.daily_every_day+$scope.daily_cron.substr(pos+2);
                //console.log($scope.daily_cron);
            }
            scheduleExp.schedule = "cron("+$scope.daily_cron+")";
            scheduleExp.retentionUnit = $scope.daily_retention;
            scheduleExp.retentionValue = $scope.daily_retention_period;

            $scope.policy.scheduleExpressions.push(scheduleExp)
        }

        if($scope.weekly == true){
            var scheduleExp = {};
            scheduleExp.name = "weekly";
            scheduleExp.schedule = "cron("+$scope.weekly_cron+")";
            scheduleExp.retentionUnit = $scope.weekly_retention;
            scheduleExp.retentionValue = $scope.weekly_retention_period;

            $scope.policy.scheduleExpressions.push(scheduleExp)
        }
        
        if($scope.monthly == true){
            var scheduleExp = {};
            scheduleExp.name = "monthly";
            scheduleExp.schedule = "cron("+$scope.monthly_cron+")";
            scheduleExp.retentionUnit = $scope.monthly_retention;
            scheduleExp.retentionValue = $scope.monthly_retention_period;

            $scope.policy.scheduleExpressions.push(scheduleExp)
        }

        if($scope.yearly == true){
            var scheduleExp = {};
            scheduleExp.name = "yearly";
            scheduleExp.schedule = "cron("+$scope.yearly_cron+")";
            scheduleExp.retentionUnit = $scope.yearly_retention;
            scheduleExp.retentionValue = $scope.yearly_retention_period;

            $scope.policy.scheduleExpressions.push(scheduleExp)

        }        

    }

    // function to populate cron expression in model varibles
    $scope.getData = function(){
        if($scope.hourly == true){
            var hourly_uri = "";
            if($scope.hourly_radio == "hourly_every"){
                hourly_uri = "hourly/every/"+$scope.hourly_every_hour
                ////console.log(hourly_uri);
                 $scope.getCron(hourly_uri, 'hourly_cron');
            }else if ($scope.hourly_radio == "hourly_starts"){
                hourly_uri = "hourly/at?hour="+$scope.hourly_starts_hour+"&minute="+$scope.hourly_starts_min
                ////console.log(hourly_uri);
                 $scope.getCron(hourly_uri, 'hourly_cron');
            }
            
        }
        if($scope.daily == true){
            var daily_uri = ""
            
            if($scope.daily_radio == "daily_every"){
                daily_uri="daily/everyDay?hour="+$scope.daily_starts_hour+"&minute="+$scope.daily_starts_min;

                $scope.getCron(daily_uri, 'daily_cron');              
                                    
                
            }else if($scope.daily_radio == "daily_every_week"){
                daily_uri = "daily/weekdays?hour="+$scope.daily_starts_hour+"&minute="+$scope.daily_starts_min;
                ////console.log(daily_uri);
                $scope.getCron(daily_uri, 'daily_cron')
            }
        }
        if($scope.weekly == true){

            var days = ""
            getSelected();
            ////console.log($scope.selectedDays)
            $scope.selectedDays.forEach(function(element) {
                days+=element.substr(0,3)+",";
            }, this);
            var weekly_uri="weekly?days="+days+"&hour="+$scope.weekly_starts_hour+"&minute="+$scope.weekly_starts_min;
                        
            $scope.getCron(weekly_uri,'weekly_cron')
        }
        if($scope.monthly == true){
            var monthly_uri="";
            if($scope.monthly_radio == 'monthly_radio_day'){

                monthly_uri = "monthly/day/"+$scope.monthly_day+"/ofEvery/"+$scope.monthly_month+"?hour="+$scope.monthly_starts_hour+"&minute="+$scope.monthly_starts_min;
                //console.log(monthly_uri);
                $scope.getCron(monthly_uri,'monthly_cron')

            }else if($scope.monthly_radio == 'monthly_radio_the'){
                // need to refactor it a bit
                var mon_day = $scope.monthly_the_mon_day.toLowerCase();
                var week_day = $scope.monthly_the_week_day.substr(0,3);
                monthly_uri = "monthly/"+mon_day+"/"+week_day+"/ofEvery/"+$scope.monthly_every_month+"?hour="+$scope.monthly_starts_hour+"&minute="+$scope.monthly_starts_min;
                //console.log(monthly_uri);
                $scope.getCron(monthly_uri,'monthly_cron');
            }   
        }
        if($scope.yearly == true){
            var yearly_uri = "";
            if($scope.yearly_radio == 'yearly_radio_every'){ 
                    
                yearly_uri = "yearly/atDay/"+$scope.yearly_every_day+"/ofEvery/"+$scope.yearly_every_year+"?hour="+$scope.yearly_starts_hour+"&minute="+$scope.yearly_starts_min;
                //console.log(yearly_uri);
                $scope.getCron(yearly_uri, 'yearly_cron');

            }else if($scope.yearly_radio == 'yearly_radio_the'){    
                var mon_day = $scope.yearly_the_mon_day.toLowerCase();   
                var week_day = $scope.yearly_the_week_day.substr(0,3);     
                yearly_uri = "yearly/"+mon_day+"/"+week_day+"/ofEvery/"+$scope.yearly_the_year+"?hour="+$scope.yearly_starts_hour+"&minute="+$scope.yearly_starts_min;
                //console.log(yearly_uri);
                $scope.getCron(yearly_uri, 'yearly_cron');
            }
        }
    }

    //function to get cron expression for each cron type(hourly, daily, weekly, monthly, yearly)
    $scope.getCron = function(resource, expression){
        var result="";
        var url = "http://www.cronmaker.com/rest/"+resource;
        $http.get(url)
        .then(function(res){           
            $scope[expression] = res.data;
            $scope.generateJSON()
            },function(err){
            //console.log(res);
        });
        
    }

    //function to filter out which are not selected under weekly week days
    function getSelected() {
        return $scope.week_days_list.filter(function (x,i) {
            return $scope.selectedDays[i];
        });
    }
});


var months_list = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

var month_day_type_list = [
    "First", 
    "Second", 
    "Third", 
    "Fourth"
];

var week_days_list = [
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday", 
    "Sunday"
];

var retention_period_list= [
    "Weeks", 
    "Months", 
    "Years"
]

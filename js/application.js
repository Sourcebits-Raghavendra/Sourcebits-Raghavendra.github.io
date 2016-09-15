/*================================================================
App ceb
==================================================================*/
'use strict';
angular.module('ceb', ['ui.router','ui.bootstrap','ngAnimate','duScroll','angularMoment'])

.config(['$stateProvider', "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/question");
    $stateProvider
        .state('question', {
            url: "/question",
            templateUrl: "partials/question.html"
        })
        .state('complete',{
        	url:"/complete",
        	templateUrl:"partials/complete.html"
        })
}]);
angular
    .module('ceb')
    .value('duScrollDuration', 1000)
    .value('duScrollOffset', 1000)
    .constant('CEB_API', {
        sessionURL:'http://192.168.10.213/CEBAPI/api/UserService/Create'
    })
/* -------------------
QUESTIONS CONTROLLER 
----------------------*/
'use strict';
angular
    .module('ceb')
    .controller('questionController', questionController);

// TIMER DEMO


function questionController($scope, $http, $log, $document, $state,$rootScope) {
    var vm = this;
    vm.open = false;
    vm.tab = true;
    vm.questionProgressPercent = 0;
    var someElement = angular.element(document.getElementById('sticky'));
    vm.openOptions = function() {
        //    if (e.target !== this)
        // return;

        vm.open = true;
    }
    vm.closeOptions = function() {

        //if (e.target !== this)
        // return;
        vm.open = false;
    }


    $http.get("images/data/testdata.json")
        .then(function(response) {

            vm.test = response.data;
            vm.test.set = 0;
            vm.test.questions = vm.test.sets[0].questions;
            vm.test.currentQuestion = vm.test.questions[0];
            vm.sectionQuestions = vm.test.questions.length;
            vm.currnetQuestionIndex = 0;
            vm.setsMaxIndex = vm.test.sets.length - 1;
            vm.currentQuestionNum = 1;

            calcQuestioPercent();
        });


    $http.get("images/data/sampleQ.json")
        .then(function(response) {
            $scope.sampletest = response.data;
            $scope.samplequestion = $scope.sampletest.question;
            $scope.sampleoption = $scope.sampletest.options;
        });

    $scope.InstructionPage = false;
    $scope.InstructionPage1 = false;
    $scope.startInstruction = function() {
        $document.find('body').css('background','none');
        $scope.InstructionPage = true;
        $scope.InstructionPage1 = false;
        window.scrollTo(0, 0);
    };

    $scope.exitAssessment = function() {
        $scope.InstructionPage = true;
        $scope.InstructionPage1 = true;
        window.location = "/";
        window.scrollTo(0, 0);
    };

    $scope.check = false;
    $scope.timercheck = false;

    var sesssionKeyGen = function() {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    var deviceType = function() {
        var deviceWidth = window.screen.width;
        if (deviceWidth < 768) {
            $scope.deviceType = "Mobile";
        } else if (deviceWidth >= 768 && deviceWidth < 992) {
            $scope.deviceType = "Tablet";
        } else if (deviceWidth > 992) {
            $scope.deviceType = "PC";
        }
    };
    $scope.first_overlay = false;
$scope.overlay = false;
$scope.info_overlay = false;
$scope.Overlay = function() {
      $scope.overlay =true;
       $scope.first_overlay =true;
        console.log("first Clicked");
    };
 $scope.answerOverlay = function() {
       $scope.info_overlay =true;
       $scope.overlay =false;
        $scope.first_overlay = true;
        console.log("Answer Clicked");
    };
     $scope.infoOverlay = function() {
       //$scope.info_overlay =true;
       $scope.overlay =true;
       $scope.info_overlay =false;
       console.log("Info Clicked");
    };
    $scope.startEvaluation = function() {
        // $document.find('body').css('background','none')
        $scope.check = true;
        var timeLimit = 60 * 10;
        startTimer(timeLimit);
        deviceType();
        $scope.sendSessionId();
        window.scrollTo(0,0);
    };

    $scope.sendSessionId = function() {
        $scope.sessionId = sesssionKeyGen();
        var sessionData = {
            "SessionId": $scope.sessionId,
            "DeviceName": $scope.deviceType
        };
        // console.log(sessionData);

            // $http({
            // method: 'POST',
            // headers: { 'Content-type': 'application/json','charset':'utf-8'},
            // data: {
            // "SessionId": $scope.sessionId,
            // "DeviceName": $scope.deviceType
            // },
            // url: 'http://192.168.10.213/CEBAPI/api/UserService/Create'
            // }).success(function(res){
                
            // })
            // .error(function(err){
            //     console.log("error",err);
            // });
    };

    $scope.count = 1;

    function endAssessment() {
        $scope.count += 1;
        $scope.InstructionPage1 = false;
    }
    function format(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        hrs = (hrs < 10) ? "0" + hrs : hrs;
        mins = (mins < 10) ? "0" + mins : mins;
        secs = (secs < 10) ? "0" + secs : secs;



        $scope.finaltime = hrs + ':' + mins + ':' + secs;        
    };
    function store(s) {
       
       $scope.oldtime = s;        
    };
$scope.click = false;
   vm.isClick = function(){
        // $document.find('body').css('background','none')
        $scope.click = true;
    }
    $scope.NewTime1 = vm.display;
    vm.showNextQuestion = function(answer,option) {
            window.scrollTo(0, 0);
            if($scope.count>19){
                $document.find('body').css('background','');
                console.log("Add image on complete ");
            }
            
            // if($scope.check && $scope.count!=21 && !$scope.timercheck){
            //         $document.find('body').css('background','none')
            //         console.log(":sdvkjasdbvalskjdvbaljshvbajkhsdv");
            //     }

            // console.log("when not clicked "+ $scope.click);
            //$scope.ans = answer;
            if($scope.click !=true) 
            {
                answer ="";

                $scope.IsRight=false;

            }
              
             if(option=='No' )
             {
                    $scope.IsRight=false;
             }
             else if(option=='Yes' && $scope.click ==true)
             {
                    $scope.IsRight=true;
             }
             $scope.ItemType = vm.test.set+1;
             $scope.QuestionNumber = vm.currentQuestionNum ;
             $scope.Answer = answer;
             if(parseInt(vm.currentQuestionNum) == 1)
            {
               // console.log("Time Taken: "+ (960 - parseInt($scope.min_sec)));
                //$scope.NewTime = '10:00' - vm.display;
                var start = moment('10:00', "mm:ss");
            var stop = moment(vm.display, "mm:ss");
            $scope.NewTime = moment.utc(start).diff(moment(stop));
            format($scope.NewTime);
            store(vm.display);
            
             //$scope.NewTime1 = moment($scope.NewTime, "mm:ss");
            }
            

            if(parseInt(vm.currentQuestionNum) != 1)
            {
               // console.log("Time Taken: "+ (960 - parseInt($scope.min_sec)));

               var start = moment(vm.display, "mm:ss");
            var stop = moment($scope.oldtime, "mm:ss");
            $scope.NewTime = moment.utc(stop).diff(moment(start));
            format($scope.NewTime);

            store(vm.display);
               
                
            }

            
           

             // console.log("ItemType:  "+ $scope.ItemType);
             // console.log("QuestionNumber: "+ $scope.QuestionNumber);
             // console.log("Answer: "+ $scope.Answer);
             // console.log("IsRight: " + $scope.IsRight);
             // console.log("Duration1: "+ vm.display);
             // console.log("Duration: "+ $scope.finaltime);
             var data1 = {
                "ItemType": $scope.ItemType,
                "QuestionNumber": $scope.QuestionNumber,
                "Answer": $scope.Answer, 
                "IsRight": $scope.IsRight,
                "Duration": $scope.finaltime,
                "User_SessionId": $scope.sessionId
            };
            // $http({
            // method: 'POST',
            // headers: { 'Content-type': 'application/json','charset':'utf-8'},
            // data: {
            // "ItemType": $scope.ItemType,
            //     "QuestionNumber": $scope.QuestionNumber,
            //     "Answer": $scope.Answer, 
            //     "IsRight": $scope.IsRight,
            //     "Duration": $scope.finaltime,
            //     "User_SessionId": $scope.sessionId
            // },
            // url: 'http://192.168.10.213/CEBAPI/api/AnswerService/CreateDWINFO'
            // }).success(function(res){
            //     console.log("success",res);
            // })
            // .error(function(err){
            //     console.log("error",err);
            // });

             


        endAssessment();
        $scope.isButtonClicked = true;
        if (vm.currnetQuestionIndex < vm.sectionQuestions - 1) {
            vm.currnetQuestionIndex += 1;
            vm.test.currentQuestion = vm.test.questions[vm.currnetQuestionIndex];
            vm.currentQuestionNum += 1;

        } else if ((vm.currnetQuestionIndex < vm.sectionQuestions - 1) || vm.test.set < vm.setsMaxIndex

        ) {
            vm.test.set += 1;
            vm.test.questions = vm.test.sets[vm.test.set].questions;
            vm.test.currentQuestion = vm.test.questions[0];
            vm.sectionQuestions = vm.test.questions.length;
            vm.currnetQuestionIndex = 0;
            vm.currentQuestionNum += 1;
            calcQuestioPercent();

        }
        calcQuestioPercent();
        $document.scrollToElementAnimated(someElement);
        $scope.click =false ;
    }

    function calcQuestioPercent() {
        (vm.currentQuestionNum == vm.test.totalQuestions) ? vm.questionProgressPercent = 100: vm.questionProgressPercent = ((vm.currentQuestionNum - 1) * 100) / vm.test.totalQuestions;
    }

    function startTimer(duration) {
        var timer = duration,
            minutes, seconds;
        setInterval(function() {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            vm.display = minutes + ":" + seconds;
            if (vm.display == "00:00") {
                $document.find('body').css('background','');
                $scope.timercheck = true;
                console.log("Timer check:" + $scope.timercheck);
            }
            vm.percent = (timer * 100) / duration;
            $scope.$apply();

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }
    //var timeLimit = 60 * 10;
    //startTimer(timeLimit);

}
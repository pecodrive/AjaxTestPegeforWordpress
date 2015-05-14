//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//*/./*   スクロール de Ａｊａｘ♪　ネイティブ版
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//
//------------------------------------ 
//ajax実行関数
//------------------------------------ 
function sendAjax( request ){
    console.log("ajax実行関数");
    request.open( "POST" , "http://pecodrive.heteml.jp/ajaxtest/wp-content/themes/ajaxtest/ajaxcontent.php" , true );
    request.setRequestHeader( "content-type" , "application/json; charset=UTF-8" );
    request.send( ajaxRequestsJson() );
}

//------------------------------------
//リクエストデータをjsonにする関数
//------------------------------------
function ajaxRequestsJson(){
    console.log("リクエストデータをjsonにする関数");
    var loopLength = elementObj().indexLoop.length;
    var requestJson = JSON.stringify({
        //グローバルに出したオブジェクトから受け取る
        nonce : AjaxData.nonce,
        category : AjaxData.category,
        tag : AjaxData.tag,
        search : AjaxData.search,
        looplength : loopLength
    });
    return requestJson;
}

//------------------------------------
//エレメントオブジェクトまとめ関数
//------------------------------------
function elementObj(){
    console.log("エレメントオブジェクトまとめ関数");
    var body = document.querySelectorAll( "body" )[0];
    var html = document.querySelectorAll( "html" )[0];
    var indexLoop = document.querySelectorAll( ".index-loop" );
    var indexLoop0 = document.querySelectorAll( ".index-loop" )[0];
    var responseArea = document.querySelectorAll( "#responseArea" );
    var responseArea0 = document.querySelectorAll( "#responseArea" )[0];
    var single = document.querySelectorAll( "#single" );
    var windowHeight = $( window ).height();
    return {
        "body" : body,
        "html" : html,
        "indexLoop" : indexLoop,
        "indexLoop0" : indexLoop0,
        "responseArea" : responseArea,
        "responseArea0" : responseArea0,
        "single" : single,
        "windowHeight" : windowHeight
        
    };
}
//------------------------------------
//スクロール取得
//------------------------------------
function bodyScrollSenser(){
    var obj = elementObj();
    var bodyScroll;
    //スクロールの取得(一応クロスブラウザ対応)
    if( obj.body.scrollTop === 0 || obj.body.scrollTop == false ){
        bodyScroll = obj.html.scrollTop;
    }else{
        bodyScroll = obj.body.scrollTop;
    }
    return bodyScroll;
}

//------------------------------------
//ajax発動位置算出関数
//------------------------------------
function processPoint(){
    var obj = elementObj();
    //index-loopは最小１列、最大では何列になるかがわからないので、横幅を計測して列数分endpointを縮小する
    if(!obj.indexLoop0){
        return { "bodyPoint" : 0 , "endPoint" : 0 };
    }else{
        var ratio = Math.floor( obj.responseArea0.offsetWidth  /  obj.indexLoop0.offsetWidth );
        var endPoint = ( allLoopHeight() / ratio );
        var bodyPoint = bodyScrollSenser() +  obj.windowHeight + (  obj.windowHeight * 0.1 );
        return { "bodyPoint" : bodyPoint , "endPoint" : endPoint };
    }
}

//------------------------------------
//要素の高さ計算関数
//------------------------------------
function allLoopHeight(){
    var obj = elementObj();
    var allLoopHeight = 0;
    //.index-loop全部の高さを合計
    for( var i = 0 ; i < obj.indexLoop.length ; i++ ){
        allLoopHeight = allLoopHeight + obj.indexLoop[i].offsetHeight;
    }
    return allLoopHeight;
}

//------------------------------------
//スクロール検知関数
//------------------------------------
function scrollSenser( request ){
    console.log("スクロール検知関数");
    var flag = AjaxData.flag;
    var obj = elementObj();
    var point = processPoint();
    //初回の動作
    if( obj.indexLoop.length === 0 && AjaxData.is_single === "false" ){
        console.log("初回やで");
        sendAjax( request );
    //二回目以降の動作
    }else if( obj.indexLoop.length > 1 ){
        //フラグチェック
        if( flag === false ){
            console.log("全部出し尽くしたで");
        //フラグがtrueだったらajaxスタートのスクロール検知の処理を続行
        }else if( flag === true ){
            //スクロールが基準値に達したらajax発動
            console.log("point.endPoint" + point.endPoint);
            console.log("point.bodyPoint" + point.bodyPoint);
            if( point.endPoint < point.bodyPoint){
                //通信中はajaxをスタートさせないようにする
                if( request.readyState === 0 /*初期化前状態*/ || request.readyState === 4 /*通信終了状態*/){ 
                    sendAjax( request );
                }
            }
        }
    }
}

//------------------------------------
//XMLHttpRequestオブジェクト作成
//------------------------------------

 var Request = new XMLHttpRequest();
  
//------------------------------------
//通信実行    
//------------------------------------

window.addEventListener( "load" ,  function(){ scrollSenser( Request ); } , false );
window.addEventListener( "scroll" , function(){ scrollSenser( Request ); } , false );

//------------------------------------
//通信開始イベントハンドラ
//----------------------------------
Request.onloadstart = function(e){
    console.log("スタートしたで");
    var obj = elementObj();
    if( AjaxData.registered !== true){
        //画面を白っぽくして…
        obj.responseArea0.style.opacity = "0.5";
        //くるくるを追加
        var element = document.createElement( "div" ); 
        element.id = "loading"; 
        element.innerHTML = "<img src='http://hellooooworld.com/wp-content/themes/helloooowolrd10-2/img/ajax-loader3.gif'>"; 
        obj.body.appendChild( element );
        AjaxData.registered = true;
    }
};

//------------------------------------
//通信中イベントハンドラ
//------------------------------------
Request.onreadystatechange = function(e){
    console.log("今" + Request.readyState + "やで");
};

//------------------------------------
//通信終了イベントハンドラ
//------------------------------------
Request.onloadend = function(e){
    console.log("終わったで");
    var obj = elementObj();
    //成功したら画面を戻して…
    obj.responseArea0.style.opacity = "1.0";
    //くるくるを外す
    var loading = document.getElementById("loading");
    obj.body.removeChild( loading );
    //くるくるフラグをセット
    AjaxData.registered = false;
};

//------------------------------------
//通信成功イベントハンドラ
//------------------------------------
Request.onload = function(e){
   //jsonデータをパース
   var responceData = JSON.parse(Request.response);
   //レスポンスされたフラグをグローバルにセット
   AjaxData.flag = responceData.flag;
   //追加エレメントを準備
   var element = document.createElement( "div" ); 
   element.innerHTML = responceData.html;
//   element.innerHTML = Request.response;
   document.querySelector( "#responseArea" ).appendChild( element );
   atachcss(obj1);
};

//------------------------------------
//通信失敗イベントハンドラ
//------------------------------------
Request.onerror = function(e){
   console.log("エラーやで");
};

//------------------------------------
//通信タイムアウトイベントハンドラ
//------------------------------------
Request.ontimeout = function(e){
   console.log("タイムアウトやで");
};

//------------------------------------
//通信中断イベント
//------------------------------------
Request.onabort = function(e){
   console.log("中断したで");
};

//------------------------------------
//通信中イベント
//------------------------------------
Request.onprogress = function(e){
   console.log("通信中やで");
};


//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//*/./*    //レスポンシブ
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*  

var w_width = $(window).width();
var breakpoint_obj ={bk:[]};
function compare(){
    var i=0,
    bl=breakpoint_obj.bk.length;
    for(;i<bl;i++){
        if(w_width<=breakpoint_obj.bk[i]){break;}
        if(w_width<=breakpoint_obj.bk[0]){i=0;break;}
        if(w_width>=breakpoint_obj.bk[breakpoint_obj.bk.length]){i=breakpoint_obj.bk.length;break;}
    }
    return i;
}
function bk_length(){
    return breakpoint_obj.bk.length;
}
function check(a){
    var i_checked;
    var ch;
    if(bk_length()!==a.length){
        if(compare()>=a.length){
            i_checked = a.length-1;
        }else{
            i_checked = compare();
        }       
    }else{
        i_checked = compare();          
    }
        return i_checked;
}
function atachcss(obj){
    var i=0,
        arr_length=obj.length;
    for(;i<arr_length;i++){
        for(var element in obj[i]){
            if(element==="serecter"){continue;}
            $(obj[i].serecter).css
            (element,obj[i][element][check(obj[i][element])]
            );
        }
    }
}
function px(a,b){
    return a*b+"px";
}

//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//*/./*    ブレイクポイント定義
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
breakpoint_obj.bk=[500,1200,9999];
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//*/./*    基本構成要素
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*

var obj1 = [
    {
        serecter:"body",
        "width":[px(w_width,1)],
        "font-size":["16px"]
    },
    {
        serecter:".index-loop",
        "width":["100%","48%","23%"],
        "margin":["0%","1%","1%"],
        "height":["inherit","370px","400px"]
    }
];




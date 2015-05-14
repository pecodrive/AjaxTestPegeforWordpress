//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//*/./*   スクロール de Ａｊａｘ♪　jQuery版
//*/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./**/./*
//
////------------------------------------
//リクエストデータをjsonにする関数
//------------------------------------
function ajaxRequestsJson(){
    var loopLength = $( ".index-loop" ).length;
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
//jqXHRオブジェクトをつくる関数
//------------------------------------
function jqueryAjax(){
    var jqXHR = $.ajax({
        type: "POST",
        url: "http://pecodrive.heteml.jp/ajaxtest/wp-content/themes/ajaxtest/ajaxcontent.php",
        data: ajaxRequestsJson()
    }).done( function( responceData ){
        doneProcess( responceData );//成功時
    }).always( function(){
        alwaysProcess();//完了時
    }).fail(function(){
        alwaysProcess();//失敗時
    });
   
    return jqXHR;
}

//------------------------------------
//通信成功時処理関数
//------------------------------------
function doneProcess( responceData ){
    //レスポンスされたフラグをグローバルにセット
    AjaxData.flag = responceData.flag;
    $( "#responseArea" ).append( responceData.html );
}
//------------------------------------
//通信開始時処理関数
//------------------------------------
function stratProcess(){
    console.log( "はじまったで" );
    if( AjaxData.registered !== true){
        //画面を白っぽくして…
        $( "#responseArea" ).css( "opacity" , "0.5" );
        //くるくるを追加
        $( "body" ).append( "<div id='loading'><img src='http://hellooooworld.com/wp-content/themes/helloooowolrd10-2/img/ajax-loader3.gif'></div>");
        //くるくるフラグをセット
        AjaxData.registered = true;
    }
}
//------------------------------------
//通信完了時処理関数
//------------------------------------
function alwaysProcess(){
    console.log( "終わったで" );
    //成功したら画面を戻して…
    $( "#responseArea" ).css( "opacity" , "1" );
    //くるくるを外す
    $( "#loading img" ).remove();
    //くるくるフラグをセット
    AjaxData.registered = false;
}

//------------------------------------
//通信失敗時処理関数
//------------------------------------
function failProcess(){
    console.log("エラーやで");
}

//------------------------------------
//スクロール検知関数
//------------------------------------
function bodyScrollSenser(){
    var bodyScroll;
    //スクロールの取得(一応クロスブラウザ対応)
    var body = $( "body" );
    var html = $( "html" );
    if( body.scrollTop === 0 || body.scrollTop == false ){
        bodyScroll = html.scrollTop();
    }else{
        bodyScroll = body.scrollTop();
    }
    return bodyScroll;
}

//------------------------------------
//要素の高さ計算関数
//------------------------------------
function allLoopHeight(){
    //.index-loop全部の高さを合計
    var allLoopHeight = 0;
    for( var i = 0 ; i < indexLoop.length ; i++ ){
        allLoopHeight = allLoopHeight + indexLoop.outerHeight();
    }
    return allLoopHeight;
}

//------------------------------------
//ajax発動位置算出関数
//------------------------------------
function processPoint(){
    var obj = elementObj();
    //index-loopは最小１列、最大では何列になるかがわからないので、横幅を計測して列数分endpointを縮小する
    var ratio = Math.floor(  obj.responseArea.outerWidth()  /  obj.indexLoop.outerWidth() );
    var endPoint = ( allLoopHeight() / ratio );
    var bodyPoint = bodyScrollSenser() +  obj.windowHeight + (  obj.windowHeight * 0.1 );
    return { "bodyPoint" : bodyPoint , "endPoint" : endPoint };
}

//------------------------------------
//エレメントオブジェクトまとめ関数
//------------------------------------
function elementObj(){
    var indexLoop = $( ".index-loop" );
    var responseArea = $( "#responseArea" );
    var windowHeight = $( window ).height();
    return {
        "indexLoop" : indexLoop,
        "responseArea" : responseArea,
        "windowHeight" : windowHeight
    };
}


//------------------------------------
//スクロール検知関数
//------------------------------------
function scrollsenser(){
    var flag = AjaxData.flag;
    var obj = elementObj();
    var point = processPoint();
    //初回の動作
    if( obj.indexLoop.length === 0 && AjaxData.is_single === false ){
        console.log("初回やで");
        jqXHR = jqueryAjax();
        stratProcess();
    //二回目以降の動作
    }else if( obj.indexLoop.length > 1 ){
        //フラグチェック
        if( flag === false ){
            console.log("全部出し尽くしたで");
        //フラグがtrueだったらajaxスタートのスクロール検知の処理を続行
        }else if( flag === true ){
            //スクロールが基準値に達したらajax発動
            if( point.endPoint < point.bodyPoint){
                //通信中はajaxをスタートさせないようにする
                if( jqXHR.readyState === 0 /*初期化前状態*/ || jqXHR.readyState === 4 /*通信終了状態*/){ 
                    jqXHR = jqueryAjax();
                    stratProcess();
                }
            }
        }
    }
}

//------------------------------------
//ajax実行
//------------------------------------
$( window ).on( "load scroll" , function(){
    scrollsenser( );
    atachcss(obj1);
});


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
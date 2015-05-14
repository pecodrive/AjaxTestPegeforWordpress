<?php
//wordpress関数を使えるようにするためにwp-load.phpを読み込む
require_once( dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php' );

//ストリームからリクエストデータを取り込む
$requests = json_decode( file_get_contents( "php://input" ) , true );

//nonceチェック　nonceが不正ならここでdie
if( ! wp_verify_nonce( $requests["nonce"] ) ){
            die( "不正やで?" );
}

//表示数の定義
$posts_per_page = get_option('posts_per_page');

//$wp_query用のクエリを拵える
$args = array(  
    'posts_per_page'   => $posts_per_page,
    'offset'           => $requests["looplength"],
    'orderby'          => 'post_date',
    'order'            => 'DESC',
    'post_type'        => 'post',
    'post_status'      => 'publish'
);

//カテゴリーアーカイブの場合
if( $requests["category"] ){
    $args = $args + array(  
        'cat' => $requests["category"]
    );
}

//タグーアーカイブの場合
if(  $requests["tag"] ){
    $args = $args + array(  
        'tag_id' => $requests["tag"]
    );
}

//検索の場合
if( $requests["search"] ){
    $args = $args + array(  
        's' => $requests["search"]
    );
}

//$wp_queryオブジェクトを作成
$wp_query = new WP_Query( $args );

//クエリに合致した投稿数をカウント
$post_count = count( $wp_query->posts );

//もし残存投稿数が$posts_per_page以下ならfalseを返してajaxを止める
if($post_count < $posts_per_page ){
    $flag = false;
}else{
    $flag = true;
}

//疑似ループにてloop部品を仕立てる
while (have_posts()){
    the_post();
    $permalink = get_the_permalink();
    $time = get_the_time('Y/m/d G:i');
    $title = get_the_title();
    $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
    $cat = get_the_category();
    $catname = $cat[0]->cat_name;
    $catid = $cat[0]->cat_ID;
    $caturl = get_category_link($catid);
    $img = $matches [1] [0];
    $tags = get_the_tags();
    $retags = array_values((array)$tags);
    $tagname = $retags[0]->name;
    $tagid = $retags[0]->term_id;
    $tagurl = get_tag_link($tagid);
    if(empty($img)){ 
        $img = get_template_directory_uri()."/img/noimage.png";
    }
    $img_tag = "<img class=\"img\" src=" . $img . ">";
    $loophtml = <<< EOF
        <div class="index-loop">
            {$img_tag}
            <span class="time">
                {$time}
            </span>
            <span class="cat">
                カテゴリー
                <a href="{$caturl}">
                    {$catname}
                </a>
            </span>
            <span class="tag">
                タグ 
                <a href="{$tagurl}">
                    {$tagname}
                </a>
            </span>        
            <span class="title">
                タイトル
                <a href="{$permalink}">
                    {$title}
                </a>
            </span>
        </div>
EOF;
    //どんどん付け足していく
    $tmp = $tmp . $loophtml;
}
//wp_reset_query();
//レスポンスデータをjson形式に整形
$data = array(
    "html" => $tmp,
    "flag" => $flag,
);
$jsonData = json_encode( $data );

//レスポンスヘッダーをセット
header( "Content-Type: application/json; X-Content-Type-Options: nosniff; charset=utf-8" );
//レスポンス送信
echo  $jsonData;

//おわり
die();


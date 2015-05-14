<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>

<?php 
    //リクエストに使うデータの準備
    $nonce = wp_create_nonce();
    if(is_single()){
        $is_single =  'true';
    }else{
        $is_single =  'false';
    }
    if(is_category()){
        $categoryId = get_query_var('cat');
    }else{
        $categoryId = '';
    }
    if(is_tag()){
        $tag = get_query_var('tag_id');
    }else{
        $tag = '';
    }
    if(is_search()){
        $search = get_query_var('s');
    }else{
        $search = '';
    }
//スクリプトを登録する
wp_enqueue_script( 'ajax', get_template_directory_uri(). '/js/ajaxnaitive.js', array('jquery') , '1.0' , false );
//登録したスクリプトに'AjaxData'というオブジェクトでデータを作成する
//これらはwp_head()の前に記述する必要がある
wp_localize_script( 
        'ajax', 
        'AjaxData',
        array( 
            flag => 'true',
            registered => 'false',
            nonce => $nonce, 
            category => $categoryId, 
            tag => $tag,
            search => $search,
            is_single => $is_single
        ) 
);
wp_head();
?>

<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">
</head>
<body>
    <div id="title">
        <?php
        //条件分岐
        //index
        if ( is_home() ) {
            echo "<span class=\"home\"><a href=\"http://pecodrive.heteml.jp/ajaxtest\">ホームに戻る</a></span>";
            echo "<span class=\"ispropaty\">index.php</span>";
            echo "<span class=\"navin\">";
            inner_search("d","s","サイト内検索");
            echo "</span>"; 
        //カテゴリアーカイブ
	}elseif( is_category() ){
            $cat_id = get_query_var('cat');
            $catindex = get_category($cat_id);
            $catindex_name = $catindex->cat_name;
            $cat_nums = $catindex->count;
            echo "<span class=\"home\"><a href=\"http://pecodrive.heteml.jp/ajaxtest\">ホームに戻る</a></span>";
            echo "<span class=\"istitle\">categoryアーカイブ</span>";
            echo "<span class=\"ispropaty\">" . $catindex_name . "(" . $cat_nums . ")</span>";
            echo "<span class=\"navin\">";
            inner_search("d","s","サイト内検索");
            echo "</span>"; 
        //タグアーカイブ
        }elseif( is_tag() ){
            $tag_id=get_query_var('tag_id');
            $tagindex = get_tag($tag_id);
            $tagindex_name = $tagindex->name;
            $tag_nums = $tagindex->count;
            echo "<span class=\"home\"><a href=\"http://pecodrive.heteml.jp/ajaxtest\">ホームに戻る</a></span>";
            echo "<span class=\"istitle\">tagアーカイブ</span>";
            echo "<span class=\"ispropaty\">" . $tagindex_name . "(" . $tag_nums . ")</span>";
            echo "<span class=\"navin\">";
            inner_search("d","s","サイト内検索");
            echo "</span>";
        //シングル
	}elseif( is_single()){
            echo "";
        //404
	}elseif( is_404()){
            echo "<span class=\"home\"><a href=\"http://pecodrive.heteml.jp/ajaxtest\">ホームに戻る</a></span>";
            echo "<span class=\"istitle\">URLが見つかりませんでした</span>";
            echo "<span class=\"ispropaty\">404</span>";
            echo "<span class=\"navin\">";
            inner_search("d","s","サイト内検索");
            echo "</span>";
        //検索
	}elseif( is_search()){
            echo "<span class=\"home\"><a href=\"http://pecodrive.heteml.jp/ajaxtest\">ホームに戻る</a></span>";
            echo "<span class=\"istitle\">検索結果</span>";
            echo "<span class=\"ispropaty\">[" . $_GET["s"] . "]</span>";
            echo "<span class=\"navin\">";
            inner_search("d","s","サイト内検索");
            echo "</span>";
        //その他
	}else{
            echo "";
	}
        ?>
    </div>
    <div id="responseArea">
    </div>
</body>
</html>
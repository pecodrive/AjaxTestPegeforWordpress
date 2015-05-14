<?php

//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
//◆◆◆　記事内の画像を取ってくる
//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
function get_the_content_image() {
	 global $post, $posts;
	 $first_img = '';
	 ob_start();
	 ob_end_clean();
	 $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
	 $first_img = $matches [1] [0];

	 if(empty($first_img)){ //Defines a default image
		 $first_img = "/no-image.gif";
	 }

	 return $first_img;
}

//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
//◆◆◆　　　文字削除（文字幅計算）
//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
function substrde_text($all_text,$text_substr){

	if( mb_strlen($all_text) >= $text_substr ){
		$substrde_text = mb_strimwidth($all_text, 0 , $text_substr * 2 , "…" , "utf-8");
		echo $substrde_text;
	}else{
		echo $all_text;	
	}
}

//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
//◆◆◆　サイト内検索出力（クラス切り替え）
//◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
function inner_search($cssclass_defult,$cssclass_is_search,$defult_text){
	$get_keyword = $_GET["s"];
	$searchurl = home_url();
	if(is_search()){
		echo <<< BBB
                    <form id="inner_srach" method="get" action={$searchurl}/>
                        <input class={$cssclass_is_search} type="text" name="s" value="  {$get_keyword}" />
                    </form>

BBB
;
		
	}else{
		echo<<< AAA
                    <form id="inner_srach" method="get" action={$searchurl}/>
			<input class={$cssclass_defult} type="text" name="s" value="  {$defult_text}" />
                    </form>
AAA
;
	}
}


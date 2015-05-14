<?php if ( have_posts() ) : the_post() ; ?>


<?php the_time('Y/m/d h:m:s');?>
<?php the_title(); ?>
<?php the_content(); ?>

<?php endif; ?>



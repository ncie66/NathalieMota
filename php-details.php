<?php
// photo-details.php
include_once($_SERVER['DOCUMENT_ROOT'] . '/wp-load.php');

$photo_ref = isset($_GET['photo_ref']) ? $_GET['photo_ref'] : '';
$photo_title = '';
$photo_ref_field = '';
$photo_category = '';
$photo_format = '';
$photo_year = '';
$photo_full = '';

$args = array(
    'post_type' => 'photos',
    'posts_per_page' => -1,
    'meta_key' => 'reference_photo',
    'orderby' => 'meta_value',
    'order' => 'ASC'
);

$all_photos = get_posts($args);

$photo_refs = array();
foreach ($all_photos as $photo) {
    $photo_refs[] = array(
        'ref' => get_post_meta($photo->ID, 'reference_photo', true),
        'title' => get_the_title($photo->ID),
        'category' => get_post_meta($photo->ID, 'categorie', true),
        'format' => get_post_meta($photo->ID, 'format', true),
        'year' => get_post_meta($photo->ID, 'annee', true),
        'full' => get_the_post_thumbnail_url($photo->ID, 'full'),
    );
}

error_log('Photos array: ' . print_r($photo_refs, true)); // Log the photos array

if (!empty($photo_ref)) {
    $args = array(
        'post_type' => 'photos',
        'meta_query' => array(
            array(
                'key' => 'reference_photo',
                'value' => $photo_ref,
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $query->the_post();
        $photo_title = get_the_title();
        $photo_ref_field = get_post_meta(get_the_ID(), 'reference_photo', true);
        $photo_category = get_post_meta(get_the_ID(), 'categorie', true);
        $photo_format = get_post_meta(get_the_ID(), 'format', true);
        $photo_year = get_post_meta(get_the_ID(), 'annee', true);
        $photo_full = get_the_post_thumbnail_url(get_the_ID(), 'full');
    }
    wp_reset_postdata();
}
?>

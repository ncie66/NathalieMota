<?php
function mon_theme_enqueue_scripts() {
    wp_enqueue_style('main-style', get_stylesheet_uri());
    global $post;
    $template_slug = get_page_template_slug($post ? $post->ID : null);
    error_log('Current template slug: ' . $template_slug);

    if (strpos($_SERVER['REQUEST_URI'], 'photo-detail.php') !== false) {
        wp_enqueue_script('photo-detail', get_template_directory_uri() . '/js/photo-detail.js', array('jquery'), null, true);
        $photos = get_all_photos();
        wp_localize_script('photo-detail', 'photoGallery', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'photos' => $photos,
            'photoRef' => isset($_GET['photo_ref']) ? sanitize_text_field($_GET['photo_ref']) : ''
        ));
        error_log("photo-detail.js enqueued based on URL");
    } else {
        wp_enqueue_script('script-js', get_template_directory_uri() . '/js/scripts.js', array('jquery'), null, true);
        wp_localize_script('script-js', 'photoGallery', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'getRandomPhotoAction' => 'get_random_photo',
            'loadFiltersAction' => 'load_filters',
            'galleryUrl' => get_stylesheet_directory_uri() . '/images'
        ));
        error_log("script-js enqueued");
    }
}
add_action('wp_enqueue_scripts', 'mon_theme_enqueue_scripts');

add_filter('template_include', 'check_page_template', 100);
function check_page_template($template) {
    $template_name = basename($template);
    error_log('The template used is: ' . $template_name);
    return $template;
}

add_action('template_include', 'enqueue_photo_detail_script', 100);
function enqueue_photo_detail_script($template) {
    if (basename($template) == 'photo-detail.php') {
        wp_enqueue_script('photo-detail', get_template_directory_uri() . '/js/photo-detail.js', array('jquery'), null, true);
        $photos = get_all_photos();
        wp_localize_script('photo-detail', 'photoGallery', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'photos' => $photos,
            'photoRef' => isset($_GET['photo_ref']) ? sanitize_text_field($_GET['photo_ref']) : ''
        ));
        error_log('photo-detail.js enqueued');
    } else {
        error_log('Not enqueuing photo-detail.js, current template: ' . basename($template));
    }
    return $template;
}


add_filter('template_include', 'check_page_template', 100);


function get_all_photos() {
    $args = array(
        'post_type' => 'photos',
        'posts_per_page' => -1,
    );

    $query = new WP_Query($args);
    $photos = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $photos[] = array(
                'title' => get_the_title(),
                'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
                'full' => get_the_post_thumbnail_url(get_the_ID(), 'full'),
                'ref' => get_field('reference_photo'),
                'category' => get_field('categorie'),
                'year' => get_field('annee'),
                'format' => get_field('format'),
                'date' => get_field('date_de_prise_de_vue')
            );
        }
        wp_reset_postdata();
    }
    error_log("Photos retrieved from get_all_photos: " . print_r($photos, true)); // Ajoutez cette ligne pour vérifier les données
    return $photos;
}




function custom_post_type_photos() {
    $labels = array(
        'name' => 'Photos',
        'singular_name' => 'Photo',
        'menu_name' => 'Photos',
        'name_admin_bar' => 'Photo',
        'add_new' => 'Ajouter une nouvelle',
        'add_new_item' => 'Ajouter une nouvelle photo',
        'new_item' => 'Nouvelle photo',
        'edit_item' => 'Éditer la photo',
        'view_item' => 'Voir la photo',
        'all_items' => 'Toutes les photos',
        'search_items' => 'Rechercher des photos',
        'not_found' => 'Aucune photo trouvée.',
        'not_found_in_trash' => 'Aucune photo trouvée dans la corbeille.',
        'featured_image' => 'Image mise en avant',
        'set_featured_image' => 'Définir l’image mise en avant',
        'remove_featured_image' => 'Supprimer l’image mise en avant',
        'use_featured_image' => 'Utiliser comme image mise en avant',
        'insert_into_item' => 'Insérer dans la photo',
        'uploaded_to_this_item' => 'Téléversé sur cette photo',
        'items_list' => 'Liste des photos',
        'items_list_navigation' => 'Navigation de la liste des photos',
        'filter_items_list' => 'Filtrer la liste des photos',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'photos'),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'menu_position' => null,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'comments'),
        'taxonomies' => array('categorie', 'format'),
    );

    register_post_type('photos', $args);
}
add_action('init', 'custom_post_type_photos');
add_theme_support('post-thumbnails', array('post', 'photos'));

function enqueue_lightbox_scripts() {
    wp_enqueue_style('simple-lightbox-css', 'https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.3/simple-lightbox.min.css');
    wp_enqueue_script('simple-lightbox-js', 'https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.3/simple-lightbox.min.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_lightbox_scripts');

function get_random_photo_hero() {
    $args = array(
        'post_type' => 'photos',
        'posts_per_page' => -1,
        'fields' => 'ids'
    );

    $query = new WP_Query($args);
    $photo_ids = $query->posts;

    if (!empty($photo_ids)) {
        $random_id = $photo_ids[array_rand($photo_ids)];
        $photo_url = wp_get_attachment_image_src(get_post_thumbnail_id($random_id), 'full');
        return $photo_url[0];
    }

    return '';
}

function get_random_photo_ajax() {
    $photo_url = get_random_photo_hero();
    if ($photo_url) {
        wp_send_json_success($photo_url);
    } else {
        wp_send_json_error('No photo found');
    }
}
add_action('wp_ajax_get_random_photo', 'get_random_photo_ajax');
add_action('wp_ajax_nopriv_get_random_photo', 'get_random_photo_ajax');

function create_photo_taxonomies() {
    register_taxonomy('categorie', 'photos', array(
        'label' => __('Catégories', 'textdomain'),
        'rewrite' => array('slug' => 'categorie'),
        'hierarchical' => true,
    ));

    register_taxonomy('format', 'photos', array(
        'label' => __('Formats', 'textdomain'),
        'rewrite' => array('slug' => 'format'),
        'hierarchical' => true,
    ));
}
add_action('init', 'create_photo_taxonomies', 0);

function load_photos() {
    $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';
    $format = isset($_POST['format']) ? sanitize_text_field($_POST['format']) : '';
    $sort_order = isset($_POST['sort_order']) ? sanitize_text_field($_POST['sort_order']) : 'desc';
    $page = isset($_POST['page']) ? intval($_POST['page']) : 1;

    $args = array(
        'post_type' => 'photos',
        'posts_per_page' => 8,
        'paged' => $page,
        'orderby' => 'date',
        'order' => $sort_order,
    );

    if ($category) {
        $args['meta_query'][] = array(
            'key' => 'categorie',
            'value' => $category,
            'compare' => 'LIKE'
        );
    }

    if ($format) {
        $args['meta_query'][] = array(
            'key' => 'format',
            'value' => $format,
            'compare' => 'LIKE'
        );
    }

    $query = new WP_Query($args);
    $photos = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $photos[] = array(
                'title' => get_the_title(),
                'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
                'full' => get_the_post_thumbnail_url(get_the_ID(), 'full'),
                'ref' => get_field('reference_photo'),
                'category' => get_field('categorie'),
                'year' => get_field('annee'),
                'format' => get_field('format'),
                'date' => get_field('date_de_prise_de_vue')
            );
        }
    }

    wp_send_json($photos);
}
add_action('wp_ajax_load_photos', 'load_photos');
add_action('wp_ajax_nopriv_load_photos', 'load_photos');


function load_filters() {
    $categories = get_meta_values('categorie', 'photos');
    $formats = get_meta_values('format', 'photos');

    if (empty($categories) && empty($formats)) {
        wp_send_json_error('Error fetching filters');
        return;
    }

    wp_send_json_success(array(
        'categories' => array_unique($categories),
        'formats' => array_unique($formats),
    ));
}

function get_meta_values($key, $post_type) {
    global $wpdb;

    $result = $wpdb->get_col($wpdb->prepare("
        SELECT DISTINCT pm.meta_value 
        FROM {$wpdb->postmeta} pm
        LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
        WHERE pm.meta_key = %s 
        AND p.post_type = %s
        AND p.post_status = 'publish'
    ", $key, $post_type));

    return $result;
}

add_action('wp_ajax_load_filters', 'load_filters');
add_action('wp_ajax_nopriv_load_filters', 'load_filters');

function fetch_related_photos() {
    $ref = isset($_GET['ref']) ? sanitize_text_field($_GET['ref']) : '';

    // Obtenir les informations de la photo actuelle
    $current_photo = get_posts(array(
        'post_type' => 'photos',
        'meta_query' => array(
            array(
                'key' => 'reference_photo',
                'value' => $ref,
                'compare' => '='
            )
        )
    ));

    if (empty($current_photo)) {
        wp_send_json_error('No related photos found.');
    }

    $current_photo_id = $current_photo[0]->ID;
    $current_category = get_post_meta($current_photo_id, 'categorie', true);
    $current_format = get_post_meta($current_photo_id, 'format', true);

    $related_photos = get_posts(array(
        'post_type' => 'photos',
        'posts_per_page' => 2,
        'post__not_in' => array($current_photo_id),
        'orderby' => 'rand',
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => 'categorie',
                'value' => $current_category,
                'compare' => 'LIKE'
            ),
            array(
                'key' => 'format',
                'value' => $current_format,
                'compare' => 'LIKE'
            )
        )
    ));

    if (empty($related_photos)) {
        wp_send_json_error('No related photos found.');
    }

    $photos = array();

    foreach ($related_photos as $photo) {
        $photos[] = array(
            'title' => get_the_title($photo->ID),
            'thumbnail' => get_the_post_thumbnail_url($photo->ID, 'thumbnail'),
            'full' => get_the_post_thumbnail_url($photo->ID, 'full'),
            'ref' => get_post_meta($photo->ID, 'reference_photo', true),
            'category' => get_post_meta($photo->ID, 'categorie', true),
            'year' => get_post_meta($photo->ID, 'annee', true),
            'format' => get_post_meta($photo->ID, 'format', true),
            'date' => get_post_meta($photo->ID, 'date_de_prise_de_vue', true)
        );
    }

    wp_send_json_success(array('photos' => $photos));
}
add_action('wp_ajax_fetch_related_photos', 'fetch_related_photos');
add_action('wp_ajax_nopriv_fetch_related_photos', 'fetch_related_photos');


function get_photo_thumbnail() {
    $ref = isset($_GET['ref']) ? sanitize_text_field($_GET['ref']) : '';

    if (empty($ref)) {
        wp_send_json_error('Missing photo reference');
    }

    $args = array(
        'post_type' => 'photos',
        'meta_query' => array(
            array(
                'key' => 'reference_photo',
                'value' => $ref,
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $query->the_post();
        $thumbnail = get_the_post_thumbnail_url(get_the_ID(), 'thumbnail');
        wp_reset_postdata();
        if ($thumbnail) {
            wp_send_json_success(array('thumbnail' => $thumbnail));
        } else {
            wp_send_json_error('Thumbnail not found');
        }
    } else {
        wp_send_json_error('Photo not found');
    }
}

add_action('wp_ajax_get_photo_thumbnail', 'get_photo_thumbnail');
add_action('wp_ajax_nopriv_get_photo_thumbnail', 'get_photo_thumbnail');


function get_adjacent_photos() {
    $ref = isset($_GET['ref']) ? sanitize_text_field($_GET['ref']) : '';

    if (empty($ref)) {
        wp_send_json_error('Missing photo reference');
    }

    $current_photo = get_posts(array(
        'post_type' => 'photos',
        'meta_query' => array(
            array(
                'key' => 'reference_photo',
                'value' => $ref,
                'compare' => '='
            )
        )
    ));

    if (!$current_photo) {
        wp_send_json_error('Photo not found');
    }

    $current_post = $current_photo[0];
    $prev_post = get_previous_post(true, '', 'category');
    $next_post = get_next_post(true, '', 'category');

    $prev_ref = $prev_post ? get_post_meta($prev_post->ID, 'reference_photo', true) : '';
    $next_ref = $next_post ? get_post_meta($next_post->ID, 'reference_photo', true) : '';

    wp_send_json_success(array(
        'prev' => $prev_ref,
        'next' => $next_ref,
    ));
}

add_action('wp_ajax_get_adjacent_photos', 'get_adjacent_photos');
add_action('wp_ajax_nopriv_get_adjacent_photos', 'get_adjacent_photos');



?>

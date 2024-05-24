<?php
function mon_theme_enqueue_styles() {
    wp_enqueue_style('main-style', get_stylesheet_uri());
    wp_enqueue_script('script-js', get_template_directory_uri() . '/js/scripts.js', array('jquery'), null, true);
    wp_localize_script('script-js', 'photoGallery', array(
        'ajaxUrl' => admin_url('admin-ajax.php')
    ));
}
add_action('wp_enqueue_scripts', 'mon_theme_enqueue_styles');


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
    );

    register_post_type('photos', $args);
}
add_action('init', 'custom_post_type_photos');
add_theme_support('post-thumbnails', array('post', 'photos'));

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

    error_log(print_r($photos, true));

    wp_send_json($photos);
}
add_action('wp_ajax_load_photos', 'load_photos');
add_action('wp_ajax_nopriv_load_photos', 'load_photos');

function enqueue_lightbox_scripts() {
    wp_enqueue_style('simple-lightbox-css', 'https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.3/simple-lightbox.min.css');
    wp_enqueue_script('simple-lightbox-js', 'https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.1.3/simple-lightbox.min.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_lightbox_scripts');

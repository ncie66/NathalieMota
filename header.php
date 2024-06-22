<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title(); ?></title>
    <?php wp_head(); ?>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simplelightbox@2.9.0/dist/simple-lightbox.min.css">

</head>
<body <?php body_class(); ?>>
    <header>
        <div class="container">
            <div class="logo">
                <a href="<?php echo home_url(); ?>">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/Logo.svg" alt="Nathalie Mota Logo">
                </a>
            </div>
            <nav>
                <ul>
                    <li><a href="<?php echo home_url(); ?>">Accueil</a></li>
                    <li><a href="<?php echo home_url('/a-propos'); ?>">À propos</a></li>
                    <li><a href="#" id="contact-link">Contact</a></li>
                </ul>
            </nav>
            <button class="menu-toggle" aria-label="Toggle menu">
                &#9776;
            </button>
        </div>
    </header>


    <section class="hero" id="hero-section">

        <div class="hero-content">
            <h1 class="hero-title">PHOTOGRAPHE EVENT</h1>

        </div>

    </section>



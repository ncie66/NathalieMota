<footer class="footer">
        <div class="footer-links">
            <ul>
                <li><a href="<?php echo home_url('/mentions-legales'); ?>">Mentions légales</a></li>
                <li><a href="<?php echo home_url('/privacy-policy'); ?>">Vie privée</a></li>
            </ul>
            <p>Tous droits réservés</p>
        </div>
        <?php get_template_part('/templates_part/modale'); ?>
    </footer>
    <?php wp_footer(); ?>
</body>
<script src="<?php echo get_template_directory_uri(); ?>/js/scripts.js"></script>
</html>
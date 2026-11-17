'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function getCsrfToken() {
    if (typeof document !== 'undefined') {
        return document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrfToken='))
            ?.split('=')[1];
    }
    return null;
}

// ── Premade templates ────────────────────────────────────────────────────────
// Fields mirror the existing Schemas/Content definitions.
// The 'title' field is always kept first and marked system:true — same as the
// backend's defaultTitleField. The PUT endpoint will keep it locked.

// ── Web Design Agency templates ───────────────────────────────────────────────
// Every discrete piece of content gets its own field (true headless CMS style).
// Placeholders carry realistic example copy so editors always know what goes where.

const TEMPLATES = [
    // ── PAGES ─────────────────────────────────────────────────────────────────

    {
        id: 'agency_home',
        label: 'Home Page',
        emoji: '🏠',
        description: 'Full agency home: hero, stats bar, about strip, services teaser, portfolio teaser, testimonials, blog strip & final CTA.',
        type: 'page',
        slugpath: '/',
        fields: [
            { name: 'title', label: 'SEO / Browser Title', type: 'text', required: true, placeholder: 'Pixel & Co — Web Design Agency', disabled: false, system: true },
            // Hero
            { name: 'hero_heading', label: 'Hero — Heading', type: 'text', required: false, placeholder: 'We Build Websites That Convert', disabled: false },
            { name: 'hero_subheading', label: 'Hero — Subheading', type: 'text', required: false, placeholder: 'Award-winning web design & development for ambitious brands.', disabled: false },
            { name: 'hero_cta_primary_label', label: 'Hero — Primary CTA Label', type: 'text', required: false, placeholder: 'Start a Project', disabled: false },
            { name: 'hero_cta_primary_url', label: 'Hero — Primary CTA URL', type: 'url', required: false, placeholder: '/contact', disabled: false },
            { name: 'hero_cta_secondary_label', label: 'Hero — Secondary CTA Label', type: 'text', required: false, placeholder: 'View Our Work', disabled: false },
            { name: 'hero_cta_secondary_url', label: 'Hero — Secondary CTA URL', type: 'url', required: false, placeholder: '/portfolio', disabled: false },
            { name: 'hero_image', label: 'Hero — Background / Feature Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Stats bar
            { name: 'stat_1_number', label: 'Stat 1 — Number', type: 'text', required: false, placeholder: '150+', disabled: false },
            { name: 'stat_1_label', label: 'Stat 1 — Label', type: 'text', required: false, placeholder: 'Projects Delivered', disabled: false },
            { name: 'stat_2_number', label: 'Stat 2 — Number', type: 'text', required: false, placeholder: '98%', disabled: false },
            { name: 'stat_2_label', label: 'Stat 2 — Label', type: 'text', required: false, placeholder: 'Client Satisfaction', disabled: false },
            { name: 'stat_3_number', label: 'Stat 3 — Number', type: 'text', required: false, placeholder: '12+', disabled: false },
            { name: 'stat_3_label', label: 'Stat 3 — Label', type: 'text', required: false, placeholder: 'Awards Won', disabled: false },
            { name: 'stat_4_number', label: 'Stat 4 — Number', type: 'text', required: false, placeholder: '8 yrs', disabled: false },
            { name: 'stat_4_label', label: 'Stat 4 — Label', type: 'text', required: false, placeholder: 'In Business', disabled: false },
            // About strip
            { name: 'about_section_heading', label: 'About Strip — Heading', type: 'text', required: false, placeholder: 'A Studio That Cares About Your Growth', disabled: false },
            { name: 'about_section_body', label: 'About Strip — Body Text', type: 'textarea', required: false, placeholder: "We're a tight-knit team of designers, developers and strategists who've helped businesses of every size punch above their weight online.", disabled: false },
            { name: 'about_section_cta_label', label: 'About Strip — CTA Label', type: 'text', required: false, placeholder: 'About Us', disabled: false },
            { name: 'about_section_cta_url', label: 'About Strip — CTA URL', type: 'url', required: false, placeholder: '/about', disabled: false },
            { name: 'about_section_image', label: 'About Strip — Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Services teaser
            { name: 'services_section_heading', label: 'Services Section — Heading', type: 'text', required: false, placeholder: 'What We Do', disabled: false },
            { name: 'services_section_subheading', label: 'Services Section — Subheading', type: 'text', required: false, placeholder: 'End-to-end digital solutions under one roof.', disabled: false },
            { name: 'services_cta_label', label: 'Services Section — CTA Label', type: 'text', required: false, placeholder: 'All Services', disabled: false },
            { name: 'services_cta_url', label: 'Services Section — CTA URL', type: 'url', required: false, placeholder: '/services', disabled: false },
            // Portfolio teaser
            { name: 'portfolio_section_heading', label: 'Portfolio Section — Heading', type: 'text', required: false, placeholder: 'Our Latest Work', disabled: false },
            { name: 'portfolio_section_subheading', label: 'Portfolio Section — Subheading', type: 'text', required: false, placeholder: 'A curated selection of recent projects.', disabled: false },
            { name: 'portfolio_cta_label', label: 'Portfolio Section — CTA Label', type: 'text', required: false, placeholder: 'View All Projects', disabled: false },
            { name: 'portfolio_cta_url', label: 'Portfolio Section — CTA URL', type: 'url', required: false, placeholder: '/portfolio', disabled: false },
            // Testimonials strip
            { name: 'testimonials_heading', label: 'Testimonials — Heading', type: 'text', required: false, placeholder: 'What Our Clients Say', disabled: false },
            { name: 'testimonials_subheading', label: 'Testimonials — Subheading', type: 'text', required: false, placeholder: "Don't take our word for it.", disabled: false },
            // Blog strip
            { name: 'blog_section_heading', label: 'Blog Strip — Heading', type: 'text', required: false, placeholder: 'Latest Insights', disabled: false },
            { name: 'blog_section_subheading', label: 'Blog Strip — Subheading', type: 'text', required: false, placeholder: 'Design tips, case studies and industry news.', disabled: false },
            { name: 'blog_cta_label', label: 'Blog Strip — CTA Label', type: 'text', required: false, placeholder: 'Read the Blog', disabled: false },
            { name: 'blog_cta_url', label: 'Blog Strip — CTA URL', type: 'url', required: false, placeholder: '/blog', disabled: false },
            // Final CTA
            { name: 'cta_section_heading', label: 'Final CTA — Heading', type: 'text', required: false, placeholder: 'Ready to Transform Your Online Presence?', disabled: false },
            { name: 'cta_section_subheading', label: 'Final CTA — Subheading', type: 'text', required: false, placeholder: "Let's build something great together.", disabled: false },
            { name: 'cta_button_label', label: 'Final CTA — Button Label', type: 'text', required: false, placeholder: 'Get a Free Quote', disabled: false },
            { name: 'cta_button_url', label: 'Final CTA — Button URL', type: 'url', required: false, placeholder: '/contact', disabled: false },
            { name: 'cta_background_image', label: 'Final CTA — Background Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // SEO
            { name: 'meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'Award-winning web design agency. We build fast, beautiful websites that grow your business.', disabled: false },
        ],
    },

    {
        id: 'agency_about',
        label: 'About Page',
        emoji: '👥',
        description: 'About page: page header, intro, our story, mission, 3 values (heading + text each), team section heading & closing CTA.',
        type: 'page',
        slugpath: '/about',
        fields: [
            { name: 'title', label: 'SEO / Browser Title', type: 'text', required: true, placeholder: 'About Us — Pixel & Co', disabled: false, system: true },
            { name: 'page_heading', label: 'Page Header — Heading', type: 'text', required: false, placeholder: 'We Are Pixel & Co', disabled: false },
            { name: 'page_subheading', label: 'Page Header — Subheading', type: 'text', required: false, placeholder: 'Designing the future, one pixel at a time.', disabled: false },
            { name: 'page_header_image', label: 'Page Header — Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'intro_text', label: 'Intro — Body Text', type: 'textarea', required: false, placeholder: "We're a full-service web design and development studio based in London. Since 2018 we've helped over 150 companies build a stronger digital presence.", disabled: false },
            // Story
            { name: 'story_heading', label: 'Our Story — Heading', type: 'text', required: false, placeholder: 'Our Story', disabled: false },
            { name: 'story_text', label: 'Our Story — Body Text', type: 'textarea', required: false, placeholder: 'Founded by two designers who believed great design should be accessible to everyone, we started in a tiny studio with big ambitions…', disabled: false },
            { name: 'story_image', label: 'Our Story — Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Mission
            { name: 'mission_heading', label: 'Mission — Heading', type: 'text', required: false, placeholder: 'Our Mission', disabled: false },
            { name: 'mission_text', label: 'Mission — Body Text', type: 'textarea', required: false, placeholder: 'To help businesses grow through powerful, beautiful digital experiences that put people first.', disabled: false },
            // Values
            { name: 'values_heading', label: 'Values — Section Heading', type: 'text', required: false, placeholder: 'What We Stand For', disabled: false },
            { name: 'value_1_title', label: 'Value 1 — Title', type: 'text', required: false, placeholder: 'Creativity', disabled: false },
            { name: 'value_1_text', label: 'Value 1 — Description', type: 'textarea', required: false, placeholder: 'We push creative boundaries to deliver solutions that stand out and resonate.', disabled: false },
            { name: 'value_2_title', label: 'Value 2 — Title', type: 'text', required: false, placeholder: 'Quality', disabled: false },
            { name: 'value_2_text', label: 'Value 2 — Description', type: 'textarea', required: false, placeholder: 'Every pixel and every line of code is crafted with obsessive attention to detail.', disabled: false },
            { name: 'value_3_title', label: 'Value 3 — Title', type: 'text', required: false, placeholder: 'Transparency', disabled: false },
            { name: 'value_3_text', label: 'Value 3 — Description', type: 'textarea', required: false, placeholder: 'Open, honest communication at every stage — no surprises, ever.', disabled: false },
            // Team section
            { name: 'team_section_heading', label: 'Team Section — Heading', type: 'text', required: false, placeholder: 'Meet the Team', disabled: false },
            { name: 'team_section_subheading', label: 'Team Section — Subheading', type: 'text', required: false, placeholder: 'The brilliant humans behind every project.', disabled: false },
            // CTA
            { name: 'cta_heading', label: 'CTA — Heading', type: 'text', required: false, placeholder: 'Want to Work With Us?', disabled: false },
            { name: 'cta_subheading', label: 'CTA — Subheading', type: 'text', required: false, placeholder: "We're always looking for exciting new projects.", disabled: false },
            { name: 'cta_button_label', label: 'CTA — Button Label', type: 'text', required: false, placeholder: 'Get in Touch', disabled: false },
            { name: 'cta_button_url', label: 'CTA — Button URL', type: 'url', required: false, placeholder: '/contact', disabled: false },
            { name: 'meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'Learn about Pixel & Co — our story, mission, values and the team behind your next great website.', disabled: false },
        ],
    },

    {
        id: 'agency_services',
        label: 'Services Page',
        emoji: '🛠️',
        description: 'Services page: intro, 4 services (heading + description + icon each), 4-step process & closing CTA.',
        type: 'page',
        slugpath: '/services',
        fields: [
            { name: 'title', label: 'SEO / Browser Title', type: 'text', required: true, placeholder: 'Services — Pixel & Co', disabled: false, system: true },
            { name: 'page_heading', label: 'Page Header — Heading', type: 'text', required: false, placeholder: 'What We Do', disabled: false },
            { name: 'page_subheading', label: 'Page Header — Subheading', type: 'text', required: false, placeholder: 'Comprehensive digital solutions for modern businesses.', disabled: false },
            { name: 'intro_text', label: 'Intro — Body Text', type: 'textarea', required: false, placeholder: 'From initial discovery right through to launch and beyond, we handle every aspect of your digital project.', disabled: false },
            // Service 1
            { name: 'service_1_heading', label: 'Service 1 — Heading', type: 'text', required: false, placeholder: 'Web Design', disabled: false },
            { name: 'service_1_text', label: 'Service 1 — Description', type: 'textarea', required: false, placeholder: 'Beautiful, conversion-focused websites designed to match your brand and delight your visitors.', disabled: false },
            { name: 'service_1_icon', label: 'Service 1 — Icon / Illustration', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Service 2
            { name: 'service_2_heading', label: 'Service 2 — Heading', type: 'text', required: false, placeholder: 'Web Development', disabled: false },
            { name: 'service_2_text', label: 'Service 2 — Description', type: 'textarea', required: false, placeholder: 'Robust, scalable web applications built with modern frameworks and clean, maintainable code.', disabled: false },
            { name: 'service_2_icon', label: 'Service 2 — Icon / Illustration', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Service 3
            { name: 'service_3_heading', label: 'Service 3 — Heading', type: 'text', required: false, placeholder: 'SEO & Performance', disabled: false },
            { name: 'service_3_text', label: 'Service 3 — Description', type: 'textarea', required: false, placeholder: 'Data-driven SEO strategies and Core Web Vitals optimisation that put you in front of the right people.', disabled: false },
            { name: 'service_3_icon', label: 'Service 3 — Icon / Illustration', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Service 4
            { name: 'service_4_heading', label: 'Service 4 — Heading', type: 'text', required: false, placeholder: 'Branding & Identity', disabled: false },
            { name: 'service_4_text', label: 'Service 4 — Description', type: 'textarea', required: false, placeholder: 'Memorable brand identities — logos, colour systems, typography and brand guidelines that scale.', disabled: false },
            { name: 'service_4_icon', label: 'Service 4 — Icon / Illustration', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Process
            { name: 'process_heading', label: 'Process — Section Heading', type: 'text', required: false, placeholder: 'Our Process', disabled: false },
            { name: 'process_subheading', label: 'Process — Subheading', type: 'text', required: false, placeholder: 'Simple, transparent and collaborative.', disabled: false },
            { name: 'step_1_title', label: 'Step 1 — Title', type: 'text', required: false, placeholder: 'Discovery', disabled: false },
            { name: 'step_1_text', label: 'Step 1 — Description', type: 'textarea', required: false, placeholder: "We learn everything about your business, goals, audience and competitors before a single pixel is designed.", disabled: false },
            { name: 'step_2_title', label: 'Step 2 — Title', type: 'text', required: false, placeholder: 'Design', disabled: false },
            { name: 'step_2_text', label: 'Step 2 — Description', type: 'textarea', required: false, placeholder: 'Wireframes, mood boards and high-fidelity mockups — reviewed and refined with you until it feels right.', disabled: false },
            { name: 'step_3_title', label: 'Step 3 — Title', type: 'text', required: false, placeholder: 'Development', disabled: false },
            { name: 'step_3_text', label: 'Step 3 — Description', type: 'textarea', required: false, placeholder: 'Pixel-perfect build with clean, fast, accessible code and thorough cross-browser and device testing.', disabled: false },
            { name: 'step_4_title', label: 'Step 4 — Title', type: 'text', required: false, placeholder: 'Launch & Support', disabled: false },
            { name: 'step_4_text', label: 'Step 4 — Description', type: 'textarea', required: false, placeholder: 'Smooth deployment, post-launch monitoring and ongoing support so you are never on your own.', disabled: false },
            // CTA
            { name: 'cta_heading', label: 'CTA — Heading', type: 'text', required: false, placeholder: 'Ready to Get Started?', disabled: false },
            { name: 'cta_subheading', label: 'CTA — Subheading', type: 'text', required: false, placeholder: 'Book a free 30-minute discovery call — no obligations.', disabled: false },
            { name: 'cta_button_label', label: 'CTA — Button Label', type: 'text', required: false, placeholder: 'Book a Free Call', disabled: false },
            { name: 'cta_button_url', label: 'CTA — Button URL', type: 'url', required: false, placeholder: '/contact', disabled: false },
            { name: 'meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'Web design, development, SEO and branding services from an award-winning agency.', disabled: false },
        ],
    },

    {
        id: 'agency_contact',
        label: 'Contact Page',
        emoji: '📬',
        description: 'Contact page: header, form intro, office address, phone, email, hours, map embed URL & social links.',
        type: 'page',
        slugpath: '/contact',
        fields: [
            { name: 'title', label: 'SEO / Browser Title', type: 'text', required: true, placeholder: 'Contact Us — Pixel & Co', disabled: false, system: true },
            { name: 'page_heading', label: 'Page Header — Heading', type: 'text', required: false, placeholder: 'Get in Touch', disabled: false },
            { name: 'page_subheading', label: 'Page Header — Subheading', type: 'text', required: false, placeholder: "We'd love to hear about your project.", disabled: false },
            { name: 'form_intro', label: 'Form — Intro Text', type: 'textarea', required: false, placeholder: 'Fill in the form and we will get back to you within one business day.', disabled: false },
            { name: 'form_success_message', label: 'Form — Success Message', type: 'text', required: false, placeholder: "Thanks! We've received your message and will be in touch soon.", disabled: false },
            // Office
            { name: 'office_heading', label: 'Office Info — Heading', type: 'text', required: false, placeholder: 'Our Office', disabled: false },
            { name: 'address_line_1', label: 'Office Info — Address Line 1', type: 'text', required: false, placeholder: '42 Pixel Street', disabled: false },
            { name: 'address_line_2', label: 'Office Info — Address Line 2', type: 'text', required: false, placeholder: 'Shoreditch, London EC1A 1BB', disabled: false },
            { name: 'phone', label: 'Office Info — Phone', type: 'text', required: false, placeholder: '+44 20 1234 5678', disabled: false },
            { name: 'email', label: 'Office Info — Email', type: 'email', required: false, placeholder: 'hello@pixelandco.com', disabled: false },
            { name: 'office_hours', label: 'Office Info — Office Hours', type: 'text', required: false, placeholder: 'Mon–Fri, 9am–6pm GMT', disabled: false },
            { name: 'map_embed_url', label: 'Office Info — Google Map Embed URL', type: 'url', required: false, placeholder: 'https://maps.google.com/…', disabled: false },
            // Social
            { name: 'social_heading', label: 'Social Links — Heading', type: 'text', required: false, placeholder: 'Find Us Online', disabled: false },
            { name: 'social_twitter', label: 'Social — Twitter / X URL', type: 'url', required: false, placeholder: 'https://twitter.com/pixelandco', disabled: false },
            { name: 'social_linkedin', label: 'Social — LinkedIn URL', type: 'url', required: false, placeholder: 'https://linkedin.com/company/pixelandco', disabled: false },
            { name: 'social_instagram', label: 'Social — Instagram URL', type: 'url', required: false, placeholder: 'https://instagram.com/pixelandco', disabled: false },
            { name: 'social_dribbble', label: 'Social — Dribbble URL', type: 'url', required: false, placeholder: 'https://dribbble.com/pixelandco', disabled: false },
            { name: 'meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'Contact Pixel & Co to discuss your next web design or development project.', disabled: false },
        ],
    },

    // ── REPEATABLE TYPES ──────────────────────────────────────────────────────

    {
        id: 'blog_post',
        label: 'Blog Post',
        emoji: '✍️',
        description: 'Repeatable blog posts: featured image, category, read time, rich-text body and SEO fields.',
        type: 'repeatable',
        slugpath: '/blog',
        fields: [
            { name: 'title', label: 'Post Title', type: 'text', required: true, autofocus: true, placeholder: 'e.g. 10 Web Design Trends to Watch in 2026', disabled: false, system: true },
            { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: '10-web-design-trends-2026', disabled: false },
            { name: 'featured_image', label: 'Featured Image', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'author', label: 'Author', type: 'relation', relation: 'users', required: false, placeholder: '', disabled: false },
            { name: 'category', label: 'Category', type: 'select', required: false, placeholder: '', disabled: false, options: { list: [{ title: 'Web Design', value: 'web_design' }, { title: 'Development', value: 'development' }, { title: 'SEO', value: 'seo' }, { title: 'Branding', value: 'branding' }, { title: 'Case Study', value: 'case_study' }, { title: 'News', value: 'news' }] } },
            { name: 'read_time', label: 'Read Time', type: 'text', required: false, placeholder: '5 min read', disabled: false },
            { name: 'summary', label: 'Excerpt / Summary', type: 'textarea', required: false, placeholder: 'A short teaser shown in listing cards and social shares.', disabled: false },
            { name: 'wysi', label: 'Body Content (WYSIWYG)', type: 'wysi', required: false, placeholder: '', disabled: false },
            { name: 'seo_meta_title', label: 'SEO — Meta Title (override)', type: 'text', required: false, placeholder: 'Leave blank to use post title.', disabled: false },
            { name: 'seo_meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'Concise description for search engines (~155 chars).', disabled: false },
        ],
    },

    {
        id: 'case_study',
        label: 'Case Study / Portfolio',
        emoji: '🖼️',
        description: 'Repeatable case studies: client info, challenge, solution, stats results, image gallery, testimonial & tech stack.',
        type: 'repeatable',
        slugpath: '/portfolio',
        fields: [
            { name: 'title', label: 'Project Name', type: 'text', required: true, autofocus: true, placeholder: 'e.g. Bloom Florists — E-commerce Redesign', disabled: false, system: true },
            { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: 'bloom-florists-ecommerce', disabled: false },
            { name: 'cover_image', label: 'Cover Image (listing card)', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'client_name', label: 'Client Name', type: 'text', required: false, placeholder: 'Bloom Florists', disabled: false },
            { name: 'project_type', label: 'Project Type', type: 'select', required: false, placeholder: '', disabled: false, options: { list: [{ title: 'Website', value: 'website' }, { title: 'E-commerce', value: 'ecommerce' }, { title: 'Web App', value: 'web_app' }, { title: 'Branding', value: 'branding' }, { title: 'SEO Campaign', value: 'seo_campaign' }, { title: 'UX Audit', value: 'ux_audit' }] } },
            { name: 'year', label: 'Year', type: 'text', required: false, placeholder: '2025', disabled: false },
            { name: 'summary', label: 'Summary (listing card)', type: 'textarea', required: false, placeholder: 'Short description shown in the portfolio grid.', disabled: false },
            // Challenge
            { name: 'challenge_heading', label: 'Challenge — Heading', type: 'text', required: false, placeholder: 'The Challenge', disabled: false },
            { name: 'challenge_text', label: 'Challenge — Body', type: 'textarea', required: false, placeholder: 'Bloom came to us with a dated website that was losing sales to competitors on mobile. Their bounce rate was 72%…', disabled: false },
            // Solution
            { name: 'solution_heading', label: 'Solution — Heading', type: 'text', required: false, placeholder: 'Our Solution', disabled: false },
            { name: 'solution_text', label: 'Solution — Body', type: 'textarea', required: false, placeholder: 'We rebuilt the site on a headless stack with a mobile-first design system, one-page checkout and real-time stock display…', disabled: false },
            // Results
            { name: 'results_heading', label: 'Results — Heading', type: 'text', required: false, placeholder: 'The Results', disabled: false },
            { name: 'results_text', label: 'Results — Body', type: 'textarea', required: false, placeholder: 'Within 3 months of launch the client saw dramatic improvements across every key metric…', disabled: false },
            { name: 'result_stat_1', label: 'Result Stat 1', type: 'text', required: false, placeholder: '+63% revenue in 3 months', disabled: false },
            { name: 'result_stat_2', label: 'Result Stat 2', type: 'text', required: false, placeholder: 'Bounce rate down from 72% to 38%', disabled: false },
            { name: 'result_stat_3', label: 'Result Stat 3', type: 'text', required: false, placeholder: 'Page speed score 97/100', disabled: false },
            // Gallery
            { name: 'gallery_image_1', label: 'Gallery — Image 1', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'gallery_image_2', label: 'Gallery — Image 2', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'gallery_image_3', label: 'Gallery — Image 3', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            // Testimonial
            { name: 'testimonial_text', label: 'Client Testimonial — Quote', type: 'textarea', required: false, placeholder: '"Pixel & Co completely transformed our online shop. The new site is stunning and the results speak for themselves."', disabled: false },
            { name: 'testimonial_author', label: 'Client Testimonial — Author Name', type: 'text', required: false, placeholder: 'Sophie Hale', disabled: false },
            { name: 'testimonial_author_role', label: 'Client Testimonial — Author Role', type: 'text', required: false, placeholder: 'Founder, Bloom Florists', disabled: false },
            { name: 'technologies_used', label: 'Technologies Used', type: 'text', required: false, placeholder: 'Next.js, Tailwind CSS, Node.js, MongoDB', disabled: false },
            { name: 'live_url', label: 'Live Site URL', type: 'url', required: false, placeholder: 'https://bloomflorists.co.uk', disabled: false },
            { name: 'seo_meta_description', label: 'SEO — Meta Description', type: 'textarea', required: false, placeholder: 'See how we helped Bloom Florists increase revenue by 63% with a mobile-first e-commerce redesign.', disabled: false },
        ],
    },

    {
        id: 'team_member',
        label: 'Team Member',
        emoji: '🧑‍💻',
        description: 'Repeatable team members: role, bio, photo & social links.',
        type: 'repeatable',
        slugpath: '/team',
        fields: [
            { name: 'title', label: 'Full Name', type: 'text', required: true, autofocus: true, placeholder: 'e.g. Sarah Chen', disabled: false, system: true },
            { name: 'slug', label: 'Slug', type: 'text', required: false, placeholder: 'sarah-chen', disabled: false },
            { name: 'role', label: 'Job Title / Role', type: 'text', required: false, placeholder: 'Lead Designer', disabled: false },
            { name: 'bio', label: 'Bio', type: 'textarea', required: false, placeholder: 'Sarah is an award-winning UX designer with 8 years of experience across fintech, e-commerce and SaaS.', disabled: false },
            { name: 'photo', label: 'Photo', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', required: false, placeholder: 'https://linkedin.com/in/sarahchen', disabled: false },
            { name: 'twitter_url', label: 'Twitter / X URL', type: 'url', required: false, placeholder: 'https://twitter.com/sarahchen', disabled: false },
            { name: 'dribbble_url', label: 'Dribbble URL', type: 'url', required: false, placeholder: 'https://dribbble.com/sarahchen', disabled: false },
            { name: 'email', label: 'Email (public)', type: 'email', required: false, placeholder: 'sarah@pixelandco.com', disabled: false },
            { name: 'order', label: 'Display Order', type: 'number', required: false, placeholder: '1', disabled: false },
        ],
    },

    {
        id: 'testimonial',
        label: 'Testimonial',
        emoji: '💬',
        description: 'Repeatable client testimonials with author photo, star rating and featured flag.',
        type: 'repeatable',
        slugpath: '/testimonials',
        fields: [
            { name: 'title', label: 'Author Name', type: 'text', required: true, autofocus: true, placeholder: 'e.g. James Walker', disabled: false, system: true },
            { name: 'author_role', label: 'Author — Job Title', type: 'text', required: false, placeholder: 'Marketing Director', disabled: false },
            { name: 'author_company', label: 'Author — Company', type: 'text', required: false, placeholder: 'Acme Corp', disabled: false },
            { name: 'author_photo', label: 'Author — Photo', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'testimonial_text', label: 'Testimonial — Quote', type: 'textarea', required: true, placeholder: '"Working with Pixel & Co was an absolute pleasure. They delivered beyond our expectations and on time."', disabled: false },
            { name: 'rating', label: 'Rating', type: 'select', required: false, placeholder: '', disabled: false, options: { list: [{ title: '5 stars', value: '5' }, { title: '4 stars', value: '4' }, { title: '3 stars', value: '3' }] } },
            { name: 'featured', label: 'Featured on Homepage?', type: 'boolean', required: false, placeholder: '', disabled: false },
            { name: 'project_link', label: 'Related Case Study URL (optional)', type: 'url', required: false, placeholder: '/portfolio/acme-corp-rebrand', disabled: false },
        ],
    },

    {
        id: 'faq',
        label: 'FAQ',
        emoji: '❓',
        description: 'Repeatable FAQ entries with question, answer, category and display order.',
        type: 'repeatable',
        slugpath: '/faq',
        fields: [
            { name: 'title', label: 'Question', type: 'text', required: true, autofocus: true, placeholder: 'e.g. How much does a website cost?', disabled: false, system: true },
            { name: 'answer', label: 'Answer', type: 'textarea', required: true, placeholder: 'Every project is different. After a free discovery call we provide a detailed, no-obligation quote — typically between £3,000 and £25,000 depending on scope.', disabled: false },
            { name: 'category', label: 'Category', type: 'select', required: false, placeholder: '', disabled: false, options: { list: [{ title: 'General', value: 'general' }, { title: 'Pricing', value: 'pricing' }, { title: 'Process', value: 'process' }, { title: 'Technical', value: 'technical' }, { title: 'Support', value: 'support' }] } },
            { name: 'order', label: 'Display Order', type: 'number', required: false, placeholder: '1', disabled: false },
        ],
    },

    {
        id: 'service_item',
        label: 'Service (repeatable)',
        emoji: '⚙️',
        description: 'Repeatable individual services — use this to drive a dynamic services list from the CMS.',
        type: 'repeatable',
        slugpath: '/services',
        fields: [
            { name: 'title', label: 'Service Name', type: 'text', required: true, autofocus: true, placeholder: 'e.g. Web Design', disabled: false, system: true },
            { name: 'slug', label: 'Slug / Anchor', type: 'text', required: false, placeholder: 'web-design', disabled: false },
            { name: 'icon', label: 'Icon / Illustration', type: 'medialibrary', required: false, placeholder: '', disabled: false },
            { name: 'short_description', label: 'Short Description (card)', type: 'text', required: false, placeholder: 'Beautiful, conversion-focused websites.', disabled: false },
            { name: 'long_description', label: 'Long Description (page)', type: 'textarea', required: false, placeholder: 'Full paragraph describing the service in detail for the dedicated service section.', disabled: false },
            { name: 'starting_price', label: 'Starting Price', type: 'text', required: false, placeholder: 'From £3,000', disabled: false },
            { name: 'cta_label', label: 'CTA Label', type: 'text', required: false, placeholder: 'Find Out More', disabled: false },
            { name: 'cta_url', label: 'CTA URL', type: 'url', required: false, placeholder: '/services/web-design', disabled: false },
            { name: 'order', label: 'Display Order', type: 'number', required: false, placeholder: '1', disabled: false },
            { name: 'featured', label: 'Featured / Highlighted?', type: 'boolean', required: false, placeholder: '', disabled: false },
        ],
    },
];

export default function CreateTypePage() {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState(null); // null = scratch
    const [name, setName] = useState('');
    const [type, setType] = useState('repeatable'); // 'repeatable' | 'page' | 'block'
    const [slugpath, setSlugpath] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const applyTemplate = (tpl) => {
        if (selectedTemplate?.id === tpl.id) {
            // deselect → back to scratch
            setSelectedTemplate(null);
            setName('');
            setType('repeatable');
            setSlugpath('');
        } else {
            setSelectedTemplate(tpl);
            setName(tpl.label);
            setType(tpl.type);
            setSlugpath(tpl.slugpath);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const csrfToken = getCsrfToken();

            // 1. Create the content type
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contenttypes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name: name.trim(), type, slugpath: slugpath.trim() }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || res.statusText);

            // 2. If a template was picked, immediately seed the fields
            if (selectedTemplate) {
                const putRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/contenttypes/${data.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        credentials: 'include',
                        body: JSON.stringify({ fields: selectedTemplate.fields }),
                    }
                );
                if (!putRes.ok) {
                    const putData = await putRes.json();
                    throw new Error(putData.error || 'Failed to seed template fields');
                }
            }

            // 3. Go to the field builder
            router.push(`/dash/customtype/${data.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">New Content Type</h2>
            <p className="text-sm text-gray-500 mb-6">
                Start from a template or build from scratch.
            </p>

            {/* ── Template picker ── */}
            <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Premade templates</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TEMPLATES.map((tpl) => {
                        const active = selectedTemplate?.id === tpl.id;
                        return (
                            <button
                                key={tpl.id}
                                type="button"
                                onClick={() => applyTemplate(tpl)}
                                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                                    active
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <p className="text-lg leading-none mb-1">{tpl.emoji}</p>
                                <p className="font-semibold text-sm text-gray-900">{tpl.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tpl.description}</p>
                                {active && (
                                    <p className="text-xs text-indigo-600 font-medium mt-1">
                                        ✓ selected — click to deselect
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
                {selectedTemplate && (
                    <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-3 py-2">
                        Template <strong>{selectedTemplate.label}</strong> will pre-fill{' '}
                        <strong>{selectedTemplate.fields.length} fields</strong> — you can still add, remove or edit them in the builder.
                    </div>
                )}
                {!selectedTemplate && (
                    <p className="mt-2 text-xs text-gray-400">No template selected — blank type with just a title field.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Type selector */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('page')}
                            className={`p-4 rounded-lg border-2 text-left transition-colors ${type === 'page'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <p className="font-semibold text-gray-900">Page</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                One instance — Home, About, Contact…
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('repeatable')}
                            className={`p-4 rounded-lg border-2 text-left transition-colors ${type === 'repeatable'
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <p className="font-semibold text-gray-900">Repeatable</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Multiple entries — Blog, Articles, Products…
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('block')}
                            className={`p-4 rounded-lg border-2 text-left transition-colors ${type === 'block'
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <p className="font-semibold text-gray-900">Block</p>
                            <p className="ui-text-xs text-gray-500 mt-0.5">
                                A section pages can add — Hero, Text + image, FAQ…
                            </p>
                        </button>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Blog Post"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {name && (
                        <p className="text-xs text-gray-400 mt-1">
                            API name:{' '}
                            <code>{name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}</code>
                        </p>
                    )}
                </div>

                {/* Slug path */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug Path <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={slugpath}
                        onChange={(e) => setSlugpath(e.target.value)}
                        placeholder="/blog"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Base path used to build canonical URLs, e.g. <code>/blog</code>
                    </p>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="flex gap-3">
                    <button className="ui-btn ui-btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Creating…' : selectedTemplate ? `Create from "${selectedTemplate.label}" →` : 'Create & Add Fields →'}
                    </button>
                    <button className="ui-btn ui-btn-secondary" type="button" onClick={() => router.back()}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}



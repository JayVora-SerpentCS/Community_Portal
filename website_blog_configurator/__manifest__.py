# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Blog Configurator',
    'version': '10.0.1.0.0',
    'category': 'website',
    'license': 'AGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'description': """ Website Blog Configurator.""",
    'depends': [
        'website_blog'
    ],
    'data': [
        'views/assets.xml',
        'views/website_blog_configuratoer_view.xml',
        'views/dynamic_blog_carousel.xml',
    ],
    'installable': True,
    'auto_install': False,
}

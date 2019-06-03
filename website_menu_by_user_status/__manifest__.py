# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Menu By User Display',
    'version': '11.0.1.0.0',
    'author': 'Savoir-faire Linux,Odoo Community Association (OCA)',
    'website': 'http://www.savoirfairelinux.com',
    'license': 'AGPL-3',
    'category': 'Website',
    'summary': 'Allow to manage the display of website.menus',
    'depends': [
        'website',
    ],
    'external_dependencies': {
        'python': [],
    },
    'data': [
        'views/website_templates.xml',
        'views/website_views.xml',
    ],
    'demo': [],
    'test': [],
    'installable': True,
}

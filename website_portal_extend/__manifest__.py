# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Portal',
    'category': 'Website',
    'summary': 'Account Management Frontend for your Customers',
    'version': '12.0.1.0.5',
    'license': 'LGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'website': (
        'https://www.odoo.com/, http://www.wearemonk.com, '
        'https://github.com/OCA/website'
    ),
    'depends': [
        'auth_signup',
        'website',
        'portal'
    ],
    'data': [
        'templates/website.xml',
        'templates/website_portal.xml',
    ],
    'installable': True,
}

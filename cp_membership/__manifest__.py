# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Membership For Community Portal',
    'category': 'Website',
    'summary': 'Membership',
    'version': '10.0.1.0.0',
    'license': 'AGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'website_community_portal',
        'membership_extension',
    ],
    'data': [
        'views/templates.xml',
        'views/res_partner_view.xml',
    ],
    'installable': True,
    'application': True,
}

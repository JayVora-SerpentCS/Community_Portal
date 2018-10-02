# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Event Rating For Community Portal',
    'category': 'Website',
    'summary': 'Event Review & Rating Management',
    'version': '10.0.1.0.0',
    'license': 'AGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'website_event',
        'website_mail',
        'rating',
    ],
    'data': [
        'views/assets.xml',
        'views/view_event_rating.xml',
    ],
    'installable': True,
    'application': True,
}

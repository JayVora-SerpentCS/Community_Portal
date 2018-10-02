# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

{
    'name': 'Event For Community Portal',
    'category': 'Website',
    'summary': 'Event Management',
    'version': '10.0.1.0.0',
    'license': 'AGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'event',
        'website_community_portal',
    ],
    'external_dependencies': {
        'python': ['xlrd']
    },
    'data': [
        'wizard/event_attendees_views.xml',
        'views/view_events.xml',
    ],
    'installable': True,
    'application': True,
}

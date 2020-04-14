# See LICENSE file for full copyright and licensing details.

{
    'name': 'Event Rating For Community Portal',
    'category': 'Website',
    'summary': 'Event Review & Rating Management',
    'version': '12.0.1.0.5',
    'license': 'LGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'website_event',
        'website_mail',
        'website_rating',
        'rating',
    ],
    'data': [
        'views/assets.xml',
        'views/view_event_rating.xml',
    ],
    'installable': True,
    'application': True,
}

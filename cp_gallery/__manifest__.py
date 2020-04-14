# See LICENSE file for full copyright and licensing details.

{
    'name': 'Gallery For Community Portal',
    'category': 'website',
    'summary': 'Gallery management',
    'version': '12.0.1.0.5',
    'license': 'LGPL-3',
    'author': 'Serpent Consulting Services Pvt. Ltd.',
    'maintainer': 'Serpent Consulting Services Pvt. Ltd.',
    'website': 'http://www.serpentcs.com',
    'depends': [
        'cp_event',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/website_menu.xml',
        'views/assets.xml',
        'views/gallery_view.xml',
        'views/template_list_events.xml',
        'views/template_show_event_photos.xml'
    ],
    'installable': True,
    'application': True,
}

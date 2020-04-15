# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import models, fields
from odoo.tools.translate import _


class WebsiteMenu(models.Model):
    """Improve website.menu with adding booleans that drive
    if the menu is displayed when the user is logger or not.
    """
    _inherit = 'website.menu'

    user_logged = fields.Boolean("User Logged", default=True,
                                 help=_("""If checked, the menu will be
                                 displayed when the user is logged."""))

    user_not_logged = fields.Boolean("User Not Logged", default=True,
                                     help=_("""If checked, the menu will be
                                     displayed when the user is not logged.""")
                                     )

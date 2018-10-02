# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

from odoo import models, api


class ResUser(models.Model):
    _inherit = 'res.users'

    @api.model
    def create(self, vals):
        vals['active'] = False
        return super(ResUser, self).create(vals)

    @api.multi
    def write(self, vals):
        if self.active:
            self.partner_id.active = False
        else:
            self.partner_id.active = True
        return super(ResUser, self).write(vals)

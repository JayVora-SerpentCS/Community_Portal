# See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class BusinessDiary(models.Model):
    _name = 'business.diary'
    _description = 'Stores Data About Member Profession'
    _rec_name = 'name'
    _sql_constraints = [('nam_uniq', 'unique(email)',
                         "This Person's Business Profile Already Exists")]

    photo = fields.Binary('Photo')
    name = fields.Many2one(
        'res.partner',
        'Name'
    )
    profession = fields.Char('Business/job/profession')
    designation_id = fields.Many2one(
        'designations',
        'Member Designation',
    )
    organization = fields.Char('Organization Name')
    street = fields.Char('Street')
    street2 = fields.Char('Street2')
    zip = fields.Char(
        'Zip',
        change_default=True
    )
    city = fields.Char('City')
    state_id = fields.Many2one(
        'res.country.state',
        string='State',
        ondelete='restrict'
    )
    country_id = fields.Many2one(
        'res.country',
        string='Country',
        ondelete='restrict'
    )
    email = fields.Char(
        'Email',
        related='name.email'
    )
    mobile = fields.Char(
        'Contact Number',
        size=10
    )
    phone = fields.Char(
        'Phone/Office Number',
        size=10
    )
    active = fields.Boolean(
        'Active',
        default=False
    )
    show_to_diary = fields.Boolean(
        'Show To Business Diary',
        default=True
    )
    remarks = fields.Text("Remarks")

    @api.multi
    @api.onchange('name')
    def dis_pic(self):
        ext = self.env['res.partner'].browse(self.name.id)
        self.photo = ext.image
        self.email = ext.email

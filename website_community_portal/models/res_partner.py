# -*- coding: utf-8 -*-
# See LICENSE file for full copyright and licensing details.

import datetime
from odoo import api, fields, models


class ResPartner(models.Model):
    _inherit = "res.partner"

    @api.onchange('city_id')
    def onchange_city(self):
        if self.city_id:
            self.state_id = self.city_id.state_id.id

    @api.multi
    def _calculate_age(self, born):
        today = datetime.datetime.today()
        try:  # raised when birth date is February 29
            # and the current year is not a leap year
            birthday = born.replace(year=today.year)
        except ValueError:
            birthday = born.replace(year=today.year, day=born.day - 1)
        if birthday > today:
            return today.year - born.year - 1
        return today.year - born.year

    @api.multi
    @api.depends('dob')
    def _compute_age(self):
        for records in self:
            years = 0
            if records.dob:
                born = datetime.datetime.strptime(records.dob, "%Y-%m-%d")
                born = born.replace(day=1)
                years = self._calculate_age(born)
                records.age = years

    city_id = fields.Many2one(
        'res.city',
        'City'
    )
    dob = fields.Date('Birthdate')
    age = fields.Integer(
        compute="_compute_age",
        string='Age',
        store=True
    )
    gender = fields.Selection(
        [('male', 'Male'), ('female', 'Female')],
        default='male',
        string='Gender'
    )
    marital = fields.Selection(
       [('single', 'Single'), ('married', 'Married'),
        ('widowed', 'Widowed'), ('divorced', 'Divorced'),
        ('awting_divorced', 'Awaiting Divorce')
        ],
       default='single',
       string='Marital Status'
    )
    children = fields.Selection(
        [('yes_living', 'Yes, living together'),
         ('yes_not_living', 'Yes, not living together'),
         ('no', 'No')],
        string='Have Children',
        default='no'
    )
    no_of_children = fields.Integer("No. of Children")
    height = fields.Many2one(
        'partner.height',
        string='Height'
    )
    body_weight = fields.Float(string='Body Weight')
    body_type = fields.Selection(
        [('average', 'Average'), ('slim', 'Slim'),
         ('athletic', 'Athletic'), ('heavy', 'Heavy')],
        string='Body Type',
        default='average'
    )
    blood_group = fields.Selection(
       [('a+', 'A+'), ('a-', 'A-'),
        ('b+', 'B+'), ('b-', 'B-'),
        ('ab+', 'AB+'), ('ab-', 'AB-'),
        ('o+', 'O+'), ('o-', 'O-')],
       string='Blood Group'
    )
    any_disability = fields.Selection(
        [('none', 'None'),
         ('disability', 'Physical Disability')],
        string='Any Disability?',
        default='none'
    )
    skin_tone = fields.Selection(
       [('very_fair', 'Very Fair'), ('fair', 'Fair'),
        ('wheatish', 'Wheatish'), ('dark', 'Dark')],
       string='Skin Tone',
       default='wheatish'
    )

    # family fields
    ex_spouse_id = fields.Many2one(
        'res.partner',
        string='Ex-spouse'
    )
    spouse_id = fields.Many2one(
        'res.partner',
        string='Spouse'
    )
    father_id = fields.Many2one(
        'res.partner',
        string="Father's Name"
    )
    father_status = fields.Selection(
        [('select', 'Select'),
         ('employed', 'Employed'),
         ('business', 'Business'),
         ('retired', 'Retired'),
         ('not_employed', 'Not Employed'),
         ('passed_away', 'Passed Away'),
         ('professional', 'Professional')],
        string="Father's Status",
        default="select"
    )
    f_company_name = fields.Char(string="With")
    f_job_title = fields.Char(string="As")
    f_nature_of_business = fields.Char(string="Nature of Business")
    mother_id = fields.Many2one(
        'res.partner',
        string="Mother's Name"
    )
    mother_status = fields.Selection(
       [('select', 'Select'),
        ('homemaker', 'Homemaker'),
        ('employed', 'Employed'),
        ('business', 'Business'),
        ('retired', 'Retired'),
        ('not_employed', 'Not Employed'),
        ('passed_away', 'Passed Away'),
        ('professional', 'Professional')],
       string="Mother's Status",
       default="homemaker"
    )
    m_company_name = fields.Char(string="With")
    m_job_title = fields.Char(string="As")
    m_nature_of_business = fields.Char(string="Nature of Business")
    family_location = fields.Many2one(
        'res.city',
        string='Family Location'
    )
    family_type = fields.Selection(
        [('joint', 'Joint'),
         ('nuclear', 'Nuclear')],
        string="Family Type",
        default="joint",
        help="""A Join Family has father's siblings living
        together with your family"""
    )
    family_values = fields.Selection(
        [('traditional', 'Traditional'),
         ('moderate', 'Moderate'),
         ('liberal', 'Liberal')],
        default="moderate",
        string="Family values"
    )
    affluence_level = fields.Selection(
        [('affluent', 'Affluent'),
         ('upper_middle_class', 'Upper Middle Class'),
         ('middle_class', 'Middle Class'),
         ('lower_middle_class', 'Lower Middle Class')],
        string='Affluence Level',
        default='middle_class'
    )
    male_not_married = fields.Integer(string='Not married')
    male_married = fields.Integer(string='Married')
    female_not_married = fields.Integer(string='Not married')
    female_married = fields.Integer(string='Married')
    remarriage = fields.Selection(
        [('yes', 'Yes'), ('no', 'No')],
        string="Remarriage"
    )
    sibling_ids = fields.Many2many(
        'res.partner',
        'silbling_partner_rel',
        'res_partner_id',
        'sibling_id',
        string='Siblings'
    )
    children_ids = fields.Many2many(
        'res.partner',
        'children_partner_rel',
        'res_partner_id',
        'children_id',
        string='Siblings'
    )

    # Education & Career
    education = fields.Selection(
        [('masters', 'Masters'), ('bachelors', 'Bachelors'),
         ('doctorate', 'Doctorate'), ('diploma', 'Diploma'),
         ('undergraduate', 'Undergraduate'),
         ('associate_degree', 'Associate degree'),
         ('honours_degree', 'Honours degree'),
         ('trade_school', 'Trade school'), ('high_school', 'High School'),
         ('lessthan_highschool', 'Less than high school')],
        string="Education",
        default="bachelors"
    )
    education_in_id = fields.Many2one(
        'education.field',
        string='Education In'
    )
    work_with = fields.Selection(
        [('pvt_company', 'Private Company'),
         ('govt', 'Government/Public Sector'),
         ('defense_civil', 'Defense/Civil Services'),
         ('business_selfemp', 'Business/Self Employed'),
         ('not_working', 'Not Working')],
        string="Working With",
        default="business_selfemp"
    )
    annual_income = fields.Selection(
        [('upto_1lakh', 'Upto INR 1 Lakh'),
         ('1lakh_to_2lakh', 'INR 1 Lakh to 2 Lakh'),
         ('2lakh_to_4lakh', 'INR 2 Lakh to 4 Lakh'),
         ('4lakh_to_7lakh', 'INR 4 Lakh to 7 Lakh'),
         ('7lakh_to_10lakh', 'INR 7 Lakh to 10 Lakh'),
         ('10lakh_to_15lakh', 'INR 10 Lakh to 15 Lakh'),
         ('15lakh_to_20lakh', 'INR 15 Lakh to 20 Lakh'),
         ('20lakh_to_30lakh', 'INR 20 Lakh to 30 Lakh'),
         ('30lakh_to_50lakh', 'INR 30 Lakh to 50 Lakh'),
         ('50lakh_to_75lakh', 'INR 50 Lakh to 75 Lakh'),
         ('75lakh_to_1crore', 'INR 75 Lakh to 1 Crore'),
         ('1crore_and_above', 'INR 1 Crore and Above'),
         ('not_applicable', 'Not applicable'),
         ('do_not_specify', 'Do not want to specify')],
        string="Annual Income",
        default="1lakh_to_2lakh"
    )
    # about me & life style
    diet = fields.Selection(
        [('jain', 'Jain'), ('veg', 'Vegetarian')],
        string="Diet",
        default="jain"
    )
    drink = fields.Selection(
        [('yes', 'Yes'), ('no', 'No'),
         ('occasionally', 'Occasionally')],
        string="Drink",
        default="no"
    )
    smoke = fields.Selection(
        [('yes', 'Yes'), ('no', 'No'),
         ('occasionally', 'Occasionally')],
        string="Smoke",
        default="no"
    )
    # Astro detail
    dob_country = fields.Many2one(
        'res.country',
        'Country Of Birth'
    )
    dob_city = fields.Many2one(
        'res.city',
        'City of Birth'
    )
    birth_time = fields.Datetime('Time of Birth')
    manglik = fields.Selection(
        [('yes', 'Yes'), ('no', 'No')],
        string="Manglik",
        default="no"
    )
    # Religion Background
    religion = fields.Selection(
        [('hindu', 'Hindu')],
        string="Religion",
        default="hindu"
    )
    community = fields.Many2one(
        'community.community',
        'Community'
    )
    sub_community = fields.Many2one(
        'sub.community',
        'Sub Community'
    )
    can_speak = fields.Many2many(
        'language.language',
        'lang_res_partner_rel',
        'res_partner_id',
        'lang_id',
        string='Can Speak'
    )
    mother_tongue = fields.Many2one(
        'mother.tongue',
        string="MotherTongue"
    )
    native = fields.Many2one(
        'res.city',
        'Native'
    )
    gotra_id = fields.Many2one(
        'gotra.gotra',
        'Gotra'
    )
    office_phone = fields.Char('Office Phone')
    # Office address
    office_street = fields.Char('Office Street')
    office_street2 = fields.Char('Office Street2')
    office_city_id = fields.Many2one(
        'res.city',
        'Office City'
    )
    office_state_id = fields.Many2one(
        'res.country.state',
        'Office State'
    )
    office_country_id = fields.Many2one(
        'res.country',
        'Office Country'
    )
    office_zip = fields.Char('Office Zip')
    achievement = fields.Text("Achievement")

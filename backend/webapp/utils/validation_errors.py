VALIDATIONS_ERRORS = {
    'required': {
        'code': 'required',
        'message': 'This field is required.',
    },
    'min_length': {
        'code': 'min_length',
        'message': 'This field must be at least {min_length} characters long.',
    },
    'max_length': {
        'code': 'max_length',
        'message': 'This field must be at most {max_length} characters long.',
    },
    'unique': {
        'code': 'unique',
        'message': 'This field must be unique.',
    },
    'password_match': {
        'code': 'password_match',
        'message': 'Passwords must match.',
    },
    'invalid': {
        'code': 'invalid',
        'message': 'This field is invalid.',
    },
    'invalid_choice': {
        'code': 'invalid_choice',
        'message': 'This field must be one of the following: {choices}.',
    },
    'invalid_email': {
        'code': 'invalid_email',
        'message': 'This field must be a valid email address.',
    }
}

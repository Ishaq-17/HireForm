// In-Memory Database Mock Fallback for HireForm MVP local testing
export const mockDb = {
  users: [
    {
      _id: 'mock-user-1',
      name: 'Guest Recruiter',
      email: 'guest.recruiter@hireform.io',
      profilePicture: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest%20Recruiter',
      createdAt: new Date(),
    }
  ],
  forms: [
    {
      _id: 'mock-form-1',
      recruiterId: 'mock-user-1',
      title: 'Frontend Developer Role',
      description: 'Join our dynamic engineering team. Please complete the application below.',
      slug: 'frontend-developer-role-mock123',
      isActive: true,
      fields: [
        {
          _id: 'mock-field-1',
          label: 'Full Name',
          type: 'Short Text',
          required: true,
          options: []
        },
        {
          _id: 'mock-field-2',
          label: 'Email Address',
          type: 'Short Text',
          required: true,
          options: []
        },
        {
          _id: 'mock-field-3',
          label: 'Years of Experience',
          type: 'Dropdown',
          required: true,
          options: ['Less than 1 year', '1 - 3 years', '3 - 5 years', '5+ years']
        }
      ],
      createdAt: new Date(),
    }
  ],
  submissions: [
    {
      _id: 'mock-sub-1',
      formId: 'mock-form-1',
      recruiterId: 'mock-user-1',
      responses: [
        { fieldLabel: 'Full Name', fieldType: 'Short Text', value: 'Jane Doe' },
        { fieldLabel: 'Email Address', fieldType: 'Short Text', value: 'jane.doe@example.com' },
        { fieldLabel: 'Years of Experience', fieldType: 'Dropdown', value: '3 - 5 years' }
      ],
      status: 'New',
      createdAt: new Date(),
    }
  ]
};

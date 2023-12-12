import * as mongoose from 'mongoose';

export const dbProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect('mongodb+srv://vidit8290:BlxRjSJ8Cd0EHnW0@cluster0.rwahrfb.mongodb.net/Nest_S3_DB'),
  },
];

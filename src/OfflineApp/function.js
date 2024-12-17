// import { database } from './database';

// // Create a new record
// export const createRecord = async (table, data) => {
//   await database.write(async () => {
//     await database.get(table).create((record) => {
//       Object.keys(data).forEach((key) => (record[key] = data[key]));
//     });
//   });
// };

// // Read all records
// export const readRecords = async (table) => {
//   return await database.get(table).query().fetch();
// };

// // Read a single record by ID
// export const readRecordById = async (table, id) => {
//   return await database.get(table).find(id);
// };

// // Update a record by ID
// export const updateRecord = async (table, id, data) => {
//   await database.write(async () => {
//     const record = await database.get(table).find(id);
//     await record.update((rec) => {
//       Object.keys(data).forEach((key) => (rec[key] = data[key]));
//     });
//   });
// };

// // Delete a record by ID (soft delete)
// export const deleteRecord = async (table, id) => {
//   await database.write(async () => {
//     const record = await database.get(table).find(id);
//     await record.markAsDeleted(); // Marks for deletion
//   });
// };

// // Permanently delete a record
// export const permanentlyDeleteRecord = async (table, id) => {
//   await database.write(async () => {
//     const record = await database.get(table).find(id);
//     await record.destroyPermanently();
//   });
// };

// // Paginated read
// export const readPaginatedRecords = async (table, page, limit) => {
//   return await database.get(table).query().fetch((page - 1) * limit, limit);
// };

// // Batch create
// export const batchCreateRecords = async (table, dataList) => {
//   await database.write(async () => {
//     const batch = dataList.map((data) =>
//       database.get(table).prepareCreate((record) => {
//         Object.keys(data).forEach((key) => (record[key] = data[key]));
//       })
//     );
//     await database.batch(...batch);
//   });
// };

// // Filtered read
// export const readFilteredRecords = async (table, filter) => {
//   return await database.get(table).query(filter).fetch();
// };

// // Sync data with the server
// export const syncDatabase = async (pullChanges, pushChanges) => {
//   await synchronize({
//     database,
//     pullChanges,
//     pushChanges,
//   });
// };



// =====> use of this function 



// // 1. Create a New User
// await createRecord('users', { name: 'John Doe', email: 'john@example.com' });

// // 2. Fetch All Users
// const users = await readRecords('users');
// console.log(users);

// // 3. Fetch a User by ID
// const user = await readRecordById('users', 'user_id_123');
// console.log(user);

// // 4. Update a User's Email
// await updateRecord('users', 'user_id_123', { email: 'newemail@example.com' });

// // 5. Delete a User (Soft Delete)
// await deleteRecord('users', 'user_id_123');

// // 6. Permanently Delete a User
// await permanentlyDeleteRecord('users', 'user_id_123');

// // 7. Fetch Users with Pagination
// const users = await readPaginatedRecords('users', 1, 10); // Page 1, 10 records per page
// console.log(users);

// // 8. Batch Create Tasks
// const tasks = [
//     { name: 'Task 1', isCompleted: false },
//     { name: 'Task 2', isCompleted: true },
//   ];
//   await batchCreateRecords('tasks', tasks);

// // 9. Fetch Filtered Records
// import { Q } from '@nozbe/watermelondb';

// const incompleteTasks = await readFilteredRecords('tasks', Q.where('is_completed', false));
// console.log(incompleteTasks);

// // 10. Synchronize with the Server
// await syncDatabase(
//     async ({ lastPulledAt }) => {
//       const response = await fetch('https://your-server.com/sync', {
//         method: 'POST',
//         body: JSON.stringify({ lastPulledAt }),
//       });
//       const { changes, timestamp } = await response.json();
//       return { changes, timestamp };
//     },
//     async ({ changes }) => {
//       await fetch('https://your-server.com/sync', {
//         method: 'POST',
//         body: JSON.stringify(changes),
//       });
//     }
//   );
  



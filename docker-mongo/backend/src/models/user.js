import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(userData) {
    const db = await getDatabase();
    const user = new User(userData);
    
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findAll() {
    const db = await getDatabase();
    return await db.collection('users').find({}).toArray();
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  static async update(id, updateData) {
    const db = await getDatabase();
    const updateDoc = {
      ...updateData,
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );
    
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const db = await getDatabase();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

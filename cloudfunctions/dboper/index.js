// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

function insetDataForDb(args) {
  let {collection, data} = args
  const coll = db.collection(collection)
  return coll.add(data)
}

function getDataFromDb(args) {
  let {collection, data, skipCount, limit} = args
  console.log(skipCount,limit);
  const coll = db.collection(collection)
  if(limit == 10){
    getData(collection, data, skipCount).get();
  }else{
    getData(collection, data, skipCount).limit(limit).get();
  }
}
function getData(collection, data, skipCount) {
  if (skipCount == 0) {
    return collection.where(data)
  } else {
    return collection.where(data).skip(skipCount)
  }
}

function getCount(args){
  let {collection} = args;
  return colletction.count()
}

function getLastItemFromDb(args) {
  let {collection, tagName, order, skipCount, limit} = args
  if (skipCount == 0) {
    return db.collection(collection).orderBy(tagName, order).limit(limit).get()
  } else {
    return db.collection(collection).orderBy(tagName, order).skip(skipCount).limit(limit).get()
  }
}

function updataItemFromDb(args) {
  let {collection, id, data} = args
  return db.collection(collection).doc(id).update(data)
}

function batch_Update (args) {
  let { collection, condition, data } = args
  return db.collection(collection).where(condition).update(data)
}

function removeItemFromDb(args) {
  let {collection, id} = args
  return db.collection(collection).doc(id).remove()
}

const dbFuncObj = {
  insetDataForDb,
  getDataFromDb,
  getLastItemFromDb,
  updataItemFromDb,
  removeItemFromDb
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  let fn = dbFuncObj[event.dbFunc]
  let data = await fn(event)
  return {
    data
  }
}
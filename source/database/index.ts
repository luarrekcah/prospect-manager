import database from '@react-native-firebase/database';

export const setItem = ({path, data}) => {
  if (!path || !data) {
    return console.warn('Sem path ou params!');
  }
  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database()
    .ref(path)
    .set(data)
    .then(() => console.log('Data set.'));
};

export const deleteItem = ({path}) => {
  if (!path) {
    return console.warn('Sem path ou params!');
  }
  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database().ref(path).remove();
};

export const getAllItems = async ({path}) => {
  if (!path) {
    return {error: 'Sem path'};
  }
  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  const allItems = await database()
    .ref(path)
    .once('value')
    .then(snapshot => {
      let alldata: Array<object> = [];
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key,
          data = childSnapshot.val();
        alldata.push({key, data});
      });
      return alldata;
    });
  return allItems;
};

export const updateItem = ({path, data}) => {
  if (!path || !data) {
    return {error: 'Sem path'};
  }
  if (path.includes('undefined')) {
    return console.warn('Path recebendo valor indefinido');
  }
  database().ref(path).update(data);
};

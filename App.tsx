import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MaskedTextInput} from 'react-native-mask-text';
import {deleteItem, getAllItems, setItem, updateItem} from './source/database';

const appsteste = [
  {
    key: 'AAAA-AAAA-AAAA-AAAA',
    data: {
      validUntil: '30-03-2023',
      lockedAcess: false,
      username: 'fulano aí',
      contact: 'raulrodriguesdemoraes@gmail.com',
    },
  },
];

const App = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const [data, setData] = React.useState([]);

  const [id, onChangeId] = React.useState('');
  const [contact, onChangeContact] = React.useState('');
  const [valid, onChangeValid] = React.useState('');
  const [key, onChangeKey] = React.useState('');

  const loadData = async () => {
    const keys = await getAllItems({path: 'prospect/keys'});
    setData(keys);
  };

  const submit = () => {
    setItem({
      path: `prospect/keys/${key}`,
      data: {
        username: id,
        contact,
        validUntil: valid,
      },
    });
    setModalVisible(false);
    onChangeId('');
    onChangeContact('');
    onChangeValid('');
    onChangeKey('');
    loadData();
  };

  const systemLock = (key: string, type: string) => {
    if (!key || !type) {
      return;
    }
    if (type === 'lock') {
      //bloquear acesso
      updateItem({path: `prospect/keys/${key}`, data: {lockedAcess: true}});
      loadData();
    } else if (type === 'unlock') {
      //desbloquear acesso
      updateItem({path: `prospect/keys/${key}`, data: {lockedAcess: false}});
      loadData();
    } else {
      return;
    }
  };

  const deleteKey = key => {
    deleteItem({path: `prospect/keys/${key}`});
    loadData();
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.center}>
          <Text style={styles.title}>Gerenciador Prospect</Text>
          <Text style={styles.desc}>Chaves de acesso</Text>
          <TouchableOpacity
            style={[styles.button, {width: '100%', marginVertical: 20}]}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.text}>
              <Icon name="key-plus" size={30} color="#fff" />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          {data !== null ? (
            data.map(item => {
              return (
                <View style={styles.row} key={item.key}>
                  <View>
                    <Text style={styles.username}>{item.data.username}</Text>
                    <Text style={styles.text}>{item.key}</Text>
                  </View>

                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        deleteKey(item.key);
                      }}>
                      <Text style={styles.text}>
                        <Icon name="delete" size={30} color="#fff" />
                      </Text>
                    </TouchableOpacity>
                    {item.data.lockedAcess ? (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {
                            marginLeft: 10,
                            backgroundColor: '#b80003',
                          },
                        ]}
                        onPress={() => {
                          systemLock(item.key, 'unlock');
                        }}>
                        <Text style={styles.text}>
                          <Icon name="lock-outline" size={30} color="#fff" />
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {backgroundColor: '#10800a', marginLeft: 10},
                        ]}
                        onPress={() => {
                          systemLock(item.key, 'lock');
                        }}>
                        <Text style={styles.text}>
                          <Icon
                            name="lock-open-outline"
                            size={30}
                            color="#fff"
                          />
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.center}>
              <Text style={styles.desc}>Sem dados</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.text}>Identificação da pessoa</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeId}
                value={id}
                placeholder="identificação"
                placeholderTextColor="#000000"
              />
              <Text style={styles.text}>Contato</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeContact}
                value={contact}
                placeholder="contato (email ou numero)"
                placeholderTextColor="#000000"
              />

              <Text style={styles.text}>Válido até (00-00-0000)</Text>
              <MaskedTextInput
                mask="99-99-9999"
                onChangeText={onChangeValid}
                style={styles.input}
                value={valid}
              />
              <Text style={styles.text}>Chave</Text>
              <MaskedTextInput
                mask="SSSS-SSSS-SSSS-SSSS"
                onChangeText={onChangeKey}
                style={styles.input}
                value={key}
              />
              <TouchableOpacity
                style={[styles.button, {marginTop: 20, paddingHorizontal: 50}]}
                onPress={() => {
                  submit();
                }}>
                <Text>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    flex: 1,
    padding: 30,
  },
  center: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  desc: {
    fontSize: 15,
    color: '#000000',
  },
  text: {
    color: '#000000',
  },
  button: {
    backgroundColor: '#363636',
    borderRadius: 30,
    alignItems: 'center',
    padding: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    color: '#000000',
    textDecorationColor: '#000000',
    paddingVertical: 10,
    width: 200,
    marginHorizontal: 40,
  },
});

export default App;

  import React, { Component } from 'react';
  import {Image,Linking, StyleSheet,Platform,Text,TextInput,TouchableOpacity,ListView, ActivityIndicator, AsyncStorage,View} from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import SafariView from 'react-native-safari-view';
  import { StackNavigator } from 'react-navigation';
  
  class App extends Component {

  constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: ''
        }
    }    

    state = {
      user: undefined, // user has not logged in yet
    };

    // Set up Linking
    componentDidMount() {

      // Add event listener to handle OAuthLogin:// URLs
      Linking.addEventListener('url', this.handleOpenURL);
      // Launched from an external URL
      Linking.getInitialURL().then((url) => {
        if (url) {
          this.handleOpenURL({ url });
        }
      });
      this._loadInitialState().done();
    };
    _loadInitialState = async () => {

       /*      var value = await AsyncStorage.getItem('user');
              if (value !== null) {
                  this.props.navigation.navigate('First');
              }
              */
        //      this.props.navigation.navigate('First');

            }
            componentWillUnmount() {
      // Remove event listener
      Linking.removeEventListener('url', this.handleOpenURL);
    };

    handleOpenURL = ({ url }) => {
      // Extract stringified user string out of the URL
      const [, user_string] = url.match(/user=([^#]+)/);
      this.setState({
        // Decode the user string and parse it into JSON
        user: JSON.parse(decodeURI(user_string))
      });
      if (Platform.OS === 'ios') {
        SafariView.dismiss();
      }
    };

    // Handle Login with Facebook button tap
    loginWithFacebook = () => this.openURL('http://localhost:3000/auth/facebook');

    list = () => this.props.navigation.navigate('First');
    addBook = () => this.props.navigation.navigate('Third');
    submit = () => {
         fetch('https://jsonplaceholder.typicode.com/posts',{
            method: 'POST' ,
            headers: {
                'Accept': ' application/json',
                 'Content-Type': 'application/json',


            },
            body: JSON.stringify({
                title: this.state.title,
                body: this.state.body
            })
            })


            .then((response) => response.json())
            .then((res) => {
                            if (res.success === true)
            {
             //       AsyncStorage.setItem('user', res.user);
                    this.props.navigation.navigate('First');
}
                else{
                    alert(res.message);
                }
})
.done();

    }       
    // Handle Login with Google button tap
    loginWithGoogle = () => this.openURL('http://localhost:3000/auth/google');

    // Open URL in a browser
    openURL = (url) => {
      // Use SafariView on iOS
      if (Platform.OS === 'ios') {
        SafariView.show({
          url: url,
          fromBottom: true,
        });
      }
      // Or Linking.openURL on Android
      else {
        Linking.openURL(url);
      }
    };
    render() {
      const { user } = this.state;
      return (
        <View style={styles.container}>
        { user
            ? // Show user info if already logged in
            <View style={styles.content}>
            <Text style={styles.header}>
            Welcome {user.name}!
            </Text>
            <View style={styles.buttons}>
            <Icon.Button
              name="list"
              backgroundColor="#3b5998"
              onPress={this.list}
              {...iconStyles}
              >
            List Book Title
            </Icon.Button>
            </View>
            <View style={styles.avatar}>
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            </View>
            </View>
            : // Show Please log in message if not
            <View style={styles.content}>
            <Text style={styles.header}>
            Welcome Stranger!
            </Text>
            <View style={styles.avatar}>
            <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
            </View>
            <Text style={styles.text}>
            Please log in to continue {'\n'}
            to the awesomness
            </Text>
            
             
            <View style={styles.buttons}>
            <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={this.loginWithFacebook}
            {...iconStyles}
            >
            Login with Facebook
            </Icon.Button>
            <Icon.Button
            name="google"
            backgroundColor="#DD4B39"
            onPress={this.loginWithGoogle}
            {...iconStyles}
            >
            Or with Google
            </Icon.Button>
            </View>
            </View>
            
        
     }

       </View>
      
        );
      }
    }

  class MainActivity extends Component {

    constructor(props) {

      super(props);

      this.state = {

        // Default Value of this State.
        Loading_Activity_Indicator: true

      }
    }

    componentDidMount() {

      return fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((responseJson) => {
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            Loading_Activity_Indicator: false,
            dataSource: ds.cloneWithRows(responseJson),
          }, function() {

            // In this block you can do something with new state.

          });
        })
        .catch((errorMsg) => {

          console.error(errorMsg);

        });
    }

    ListViewItemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      );
    }

    Navigate_To_Second_Activity=(rowData)=>
      {
        //Sending the JSON ListView Selected Item Value On Next Activity.
        this.props.navigation.navigate('Second', { JSON_ListView_Clicked_Item1: rowData.title});
        this.props.navigation.navigate('Second', { JSON_ListView_Clicked_Item2: rowData.body});

      }

    static navigationOptions =
      {

       title: 'MainActivity',

      };


    render()
    {
      if (this.state.Loading_Activity_Indicator) {
        return (
          <View style={styles.ActivityIndicator_Style}>

            <ActivityIndicator size = "large" color="#009688"/>

          </View>
        );
      }

      return (
      <View style={styles.MainContainer}>

         
          <ListView

            dataSource={this.state.dataSource}

            renderSeparator= {this.ListViewItemSeparator}

            renderRow={(rowData) => <Text style={styles.rowViewContainer}
            onPress={this.Navigate_To_Second_Activity.bind(this, rowData)} >{rowData.title}</Text>

            }

          />

        </View>
      );
    }
  }


  class SecondActivity extends Component
  {
    static navigationOptions =
    {
       title: 'SecondActivity',
    };

    render()
    {
       return(
          <View style = { styles.MainContainer }>

             <Text style = { styles.TextStyle }> { this.props.navigation.state.params.JSON_ListView_Clicked_Item1 } </Text>
               <Text style = { styles.TextStyle }> { this.props.navigation.state.params.JSON_ListView_Clicked_Item2 } </Text>
          </View>
       );
    }
  }

  class ThirdActivity extends Component
  {
    static navigationOptions =
    {
       title: 'ThirdActivity',
    };

    render()
    {
       return(
          <View style = { styles.MainContainer }>

                    <TextInput
                        style={styles.textInput} placeholder='title'
                        onChangeText={ (title) => this.setState({title})}
                        underlineColorAndroid='transparent'
                     />

                      <TextInput
                        style={styles.textInput} placeholder='body'
                                             onChangeText={ (body) => this.setState({body})}
                                             underlineColorAndroid='transparent'
                                          />

                       <TouchableOpacity
                         style={styles.btn}
                         onPress={this.submit}>
                         <Text>Submit</Text>
                         </TouchableOpacity>
                  </View>
       );
    }
  }
    const iconStyles = {
      borderRadius: 10,
      iconStyle: { paddingVertical: 5 },
    };

    export default MyProject = StackNavigator( {

      Zero: {screen: App},
      First: { screen: MainActivity },
      Second: { screen: SecondActivity },
      Third: { screen: ThirdActivity}

    });
    const styles = StyleSheet.create({
      MainContainer:
      {
       justifyContent: 'center',
       flex:1,
       margin: 10
     },

     TextStyle:
     {
       fontSize: 23,
       textAlign: 'center',
       color: '#000',
     },

     rowViewContainer:
     {

      fontSize: 17,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,

    },

    ActivityIndicator_Style:
    {

      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,

    },
    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      margin: 20,
    },
    avatarImage: {
      borderRadius: 50,
      height: 100,
      width: 100,
    },
    header: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    text: {
      textAlign: 'center',
      color: '#333',
      marginBottom: 5,
    },
    buttons: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      margin: 20,
      marginBottom: 30,
    }
  });
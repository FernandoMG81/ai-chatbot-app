import { useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import GlobalApi from '../Services/GlobalApi'
import { FontAwesome } from '@expo/vector-icons'
import Constants from 'expo-constants'

export default function ChatScreen () {
  const param = useRoute().params
  const { name, image } = param.selectedFace

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello, I'm ${name}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: image
        }
      }
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    if (messages[0].text) {
      getBardResp(messages[0].text)
    }
  }, [])

  const getBardResp = (msg) => {
    setLoading(true)
    GlobalApi.getBardApi(msg).then(resp => {
      if (resp.data.resp[1].content) {
        setLoading(false)
        const chatAIResp = {
          _id: Math.random() * (9999999 - 1),
          text: resp.data.resp[1].content,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: image

          }
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp))
      } else {
        setLoading(false)
        const chatAIResp = {
          _id: Math.random() * (9999999 - 1),
          text: 'Sorry, I can not help with it',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: image

          }
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp))
      }
    },
    error => {
      console.log(error)
    })
  }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#671ddf'
          },
          left: {
          }
        }}
        textStyle={{
          right: {
            // fontSize:20,
            padding: 2
          },
          left: {
            color: '#671ddf',
            // fontSize:20,
            padding: 2
          }
        }}
      />
    )
  }

  const renderInputToolbar = (props) => {
    // Add the extra styles via containerStyle
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          padding: 3,
          backgroundColor: '#671ddf',
          color: '#fff'
        }}
        textInputStyle={{ color: '#fff' }}
      />
    )
  }

  const renderSend = (props) => {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <FontAwesome name='send' size={24} color='white' resizeMode='center' />
        </View>
      </Send>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: Constants.statusBarHeight, marginBottom: 15 }}>
      <StatusBar
        barStyle='dark-content'
      />
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />
    </View>
  )
}

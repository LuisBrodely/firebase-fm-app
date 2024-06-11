import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import { FC } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import moment from 'moment';

export interface ChatRowProps {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
}

const ChatRow: FC<ChatRowProps> = ({ id, name, avatar, email }) => {
    return (
        <AppleStyleSwipeableRow>
            <View>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#DCDCE2'>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 14,
                            paddingLeft: 20,
                            paddingVertical: 10,
                        }}>
                        <Image source={{ uri: avatar ?? ''}} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color:'#F1F1F1' }}>{name}</Text>
                            <Text style={{ fontSize: 16, color: '#6E6E73' }}>
                                {email.length > 40 ? `${email.substring(0, 40)}...` : email}
                            </Text>
                        </View>
{/*                         <Text style={{ color: '#6E6E73', paddingRight: 20, alignSelf: 'flex-start' }}>
                            {moment(Date()).fromNow()}
                        </Text> */}
                    </View>
                </TouchableHighlight>
            </View>
        </AppleStyleSwipeableRow>
    );
};
export default ChatRow;
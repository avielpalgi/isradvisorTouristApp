import React, { useState, useEffect, useCallback } from 'react';
import { Text, Alert, View, ImageBackground, StyleSheet, ScrollView, Modal, TouchableHighlight, Button, Linking, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons'
import WeeklyCalendar from 'react-native-weekly-calendar';
import MapView, { Marker } from 'react-native-maps';
import WatingToTrip from './watingToChat'



const myTrip = ({ navigation }) => {

    const [myList, setMyList] = useState([]);
    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentElement, setCurrentElement] = useState('');
    const [supportedURL, setsupportedURL] = useState('');
    const [MapVisible, setMapVisible] = useState(false);
    const [TripVisible, setTripVisible] = useState(false);
   
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            readUserData();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation])


    const readUserData = async () => {
        try {
            await AsyncStorage.getItem('ProfileTourist').then(async (value) => {
                if (value !== null) {
                    data = JSON.parse(value);
                    setProfile(data);
                    getTripPlan(data.Email);
                }
            })

        }
        catch (e) {
            console.warn('failed to fetch data')

        }

    }

    const getTripPlan = (email) => {
        fetch('http://proj.ruppin.ac.il/bgroup10/PROD/api/BuildTrip?email=' + email, {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                setMyList(result);
                convertArray(result);

                (error) => {
                    console.warn("err post=", error);
                };
            })

    }
    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // if (url == "") {
            //     Alert.alert('Error,There is no such a website')

            // } else {
            // Checking if the link is supported for links with custom URL scheme.

            if (url == "") {
                Alert.alert('Error,There is no such a website')
            } else {
                const supported = await Linking.canOpenURL(url);

                if (supported) {
                    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                    // by some browser in the mobile
                    await Linking.openURL(url);
                } else {
                    Alert.alert(`Don't know how to open this URL: ${url}`);
                }
            }


        }, [url]);

        return <Button title={children} onPress={handlePress} />;
    };



    const showModal = (element) => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>{element.AttractionName}</Text>
                            <Text style={styles.modalText}>{element.AreaName}</Text>
                            <Text style={styles.modalMainText}>{element.FullDescription}</Text>
                            <OpenURLButton url={supportedURL}>Open Website</OpenURLButton>
                            <Button onPress={() => setMapVisible(true)} title="show map" />
                        </ScrollView>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Exit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    const abcd = (element) => {
        setCurrentElement(element)
        setsupportedURL(element.Product_Url);
        setModalVisible(true)
    }
    const image = {
        uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUREhIWFhUXFRgWFRcXFRYYFRUXGBcXGBcWFRgYHSggGBolHRcWITEiJyktLi4uGCAzOjMsNygtLisBCgoKDg0OGhAQGy8lHSYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALgBEwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwEEBQAGB//EAD4QAAECBQIDBgQEBQMDBQAAAAECEQADEiExBEEiUWEFE3GBkaEyQrHwUsHR4RQjYnKSM4LxBhWiNIOy0/L/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBQQG/8QAKxEAAgEDBAIABAcBAAAAAAAAAAERAgMSBCExQRNRBWGBoSIycZHR4fCx/9oADAMBAAIRAxEAPwDGTMKSBYB9xg8ud/zjQ0QCV1psD8X0IIOIDtDSUkjHIk3DWKX9B5wlnT42UDZ93HIiOUdbYsdt6JzWzosSB8QIPxJOXYAN0HllzHlnvEKAAYgi73uGwLbNvtaPUadBmJBf+7lcW8v1jO13ZyUhRCXULkA/EGsQMA2bYEvFpmTRS7QliYO/QzFq07pOH8DaKFMW+4QFAJFwm4LC3TobHo8BNlspttvvY9I+i+G66l0+K44a4/Q4mu0dSqdyhSnyIpjqYaExNMdk5UiqYmmGUxNMMJF0xNMMpiaYBSLCYmmGUxNMASLpggIOmJpgFIATBNBhMSEwBIATBBMGEwQTCCQAmDCYIJgwmAUgBMEEwYTBBMIJACYIJgwmCCYQ5ACYIJgwmDCYQSLCYIJgwmDCYQSLCYIJhgTBBMKQFUxNMNCYmmFIxNMdDqY6FIxcyT3qQHDEMDm9mNXg993Yxg6NBRMXLvUlXEGZ0G6Fp5sSU+T2j0GgSwpJAOxGDbLPAdraVwJyE/zE5pyRksDmz2yRHxR9gqo5E6NbMDYKcedyCOmfSLnenBycVMxN/R4rSlIcIUkgkAOLhJ5HcdH5mGzAlX8uYHJFv6hzHX6RMFNpmRrOzkLXZ0qJLXpuzliNwHLb+rUdMmZQpCi05BIfDkXqGzDLcvCN3XSVBL52JZzb4V4+Ic4qTNLUDNllloUalPYhtnJNiCelUWn0yKljvSVNNKStLVtNuaVfMNwFbqHv1JhZTFsaMC7f1s2DhW1vL8orytSuSigpK5ZcCplTAHwDu3rbzPW0nxOq1ThWpXXv+znar4fTdedDhgUxLRal6UmWFA1H5rMQ7UuOr7bwqiO/Y1Nu/TlQzi3rFdmrGtCgmCphgTE0xsYCwmJphlMEEwAKpiQmG0xITAIWEwQTDAmJCYAACYIJgwmCCYQABMEEwYTBBMKQACYIJhgTBBMKQACYIJgwmDCYUjACYkJhoTBBMTICgmCCYaEwQTCkYsJggiGBMEExMjFBMEEwymCCYUjgVTEQ+mOhSODPUmogAkFwWs48hscH9YvLSVyyEKpUzg04LB7cw7w1egExI2NyCGsaiAbjrGdrVz5U2lmSQTXlLgOCdxexfnvaPj0fW1OdgFyS6a/9RhxCwUSL7XDgWIhqEEoFR4huRu2bWYxWOvTPlrAQQpCgFpyz3dLbEX8oro1SwupSiZYspvjCncEtkEED/mFEMpbqUaSQ4pHK787xVFY+AJP4kmwtulsfu/SHlYUl0lwQ4UDsRYg/ftCpFRCqiO8AIsLtspnvt06CEMqaqUpCqkhRSS7PhjsOn58ordpSioCgsVK4gQOLY32NvYRpTf5qLuCzs5Sf23HnGbOSQFEJ2drMWDqA5HcecNMInZh9ldnTJakgpdKkkL4irAznDEDoWi32nogsJVLXSQoVgAEkAsbb8y17Q3sPWFfAeJSSnL3ChwrS/UFJDZEZ3bijLUsFJKCe8S1impz/ALk1EuOYMbW7ldDmlwY3LdFSxqUk6mX3ZAmEAksDsSXYAnextHUxWl9oGmlRqTsFMWIuz5BDAjwiyuekKFwyiyQGtbceR/aO1pPinFF39/5ORqvh2zqtft/BNMSEw1KXggiOyqk1KOQ004YkJggmHBESEQSISEQQRDgiCCIJASEQQRDgiCCIUjEhEEEQ0IggiJyEKCIIIhoTBhMLIYoJggmGhMSExMjgAJggmDpggmFIQLCYIJhgTBBMKSoFhMEEwYTBBMTI4ACYkJhgTBBMKRpCqYmGtEQpHBa0klJlgps6XAYtf97xT7Z0JmSylg4ZQ2B5gje3kfpo6AvKQoDZw72F2ceDCK2qmhUtfdkBSagz2BGQ2xu42PhHzDX4T6dP8R53s2YJcoBZClBJSsgAOkPSPBrP06xVloJWUgPUC4IIyMZt+Ri0rTHu1d69JYC44rWAtnZufPML7VlBKUTkKAZgnLBWAkjIuG84w3ZuoTfoR2brkJmGWT8xBBIIUkh/Lx8cxq0lCqgMWFxxJ5X8vOMyfJQZyF247AFIIUoXar5S7jq+DtrS5wUGwUsWPxAM7K6taGLsTrNPhctRY/A1mO4td7Y/paKKpZLAAB7Aja30Y28uUbaQzpPwquCNt3ilOQUl1JJ4mWzMcMpuoa43gEZHZKyiYpABCgkFJSLOlbqBANhlvE8o3teBNlJmlGCQsEXoqIdj1D879Iy5uheYFpYMsr/uqTSWPO2PHcgjY7MWlSFAklMypYqBDBQDpL+vgekUvQVezzGp7OSlKik1FKri702N/UEeEVtV2caSUkAoUwe5BBLMcB9ns0aBlsog8ghQBAU4ZIcnmABkYB8LOq06uFbDDLDPVfiDsxZnBYfkBMdSgxtL2gQAFlrlJdPzMLOd/NotaftNNhMISo4BcP0GQ43vzitrOBQIS6TclwXS3CcsSH9COkMEhKxcBxcY9b8rx67GquWfyvb10eW9prd78y+vZrywCHFweVxBhEYfZU8yVqSbyy54cJL8si3qz5z6GQtK0hSS4OD94PSO/p9XTeplc+jganS1Wao69gBEEEQ4IggmN8jzQJCIIJhoRBBEKQgUExITDQiCCIUjgUEwQTDQiJphZDgUEwQTDQmJCYWQ4FhMSEw0IgwiFI4EhMEEw0IggmJkeIoJggmGhMSEwpKxFhMSEw0JiaYUlJCqY6HUxMKRwW0fDa8UtckYxXZTZIAc+cX0lxwtzaKU3TkzkEpNIBOxBJDN7x89VwfQU8laboOFLliGJwQ+SMjd9t8RWm6OXRTNSCCT8RBdnyTnY3vGxMS4uHxnn1DNC5iBe3m33aIdJSqPPSOzwgd2CVAuoEnYuzFvlsPQwtS1ImoNPAtwrPAtLu45EUt+8a50aVThSCAhKQbWuSTbmWTHa3RqEqatg4FYAu6kAEf7tohUst1FabLDs3w3Rmzg2s1mJHl0hSpwdKVPfhBazfhVy6em8Pk10oJy2BZs8/v3gO05JCCopcXcBiGdnINt3hDRVmopVvS1jsMXP3jwEW+ygAplsVOSKhglw3WxY+UVUTBMlDu1PbY8hf8AffeEGQpcyWtJUD8JTYJLlklQPInILEE9IED9DO1tB3c2oBxYmz2alw+4x6czFrTpC0JZIbmPxOTcbgv7Dq2rp9KtUshYuk8Jfk4IPPHuIzEICF/0KuOlmII6b9M4htQGUqOzJ7R0gYMlLg+AIIa234eto88jS0rSpC6QLsSTcPwmzsxT4H39rrtJxKKGDmpiCQXDKs48bHfxjz+t09BBHwg35B2tvt9ByhpxsCSq5MzWTQg7FNsYII9x+8P0+qVJ+FThQe7t6bEY294sztGCKk4URbNJDEeDkNflCNLpRMqswu74Znd+blm5Eco0pqdO65M3RMp7o9FoNSmYkEZa4/McxFsIjy+j0ykIBlqBUhbuHAJsClVRZuLIAHNtriP+pqVATZRCSwC0nchwFINxvdzt4R17GvpqUV7M5Go0FVLmjdf8N0IggiJ0s5EwOhQI6Q6iPaq01KPBg1sxQRE0w4IggiFkPETTEhEOCIIIgyHiJCIIIhoRBBELIeIkJggmHBEEEQsh4iQmJCYcEQQTCyKVAkIggmHBMSEwsisRQRBBMNCImiJyKVImmOh9EdBkPERLkzEqcKJTSfiSLGzXBFvLzgDqTUUKFwxGbjldnIa9940T9iAmJByzdY4kHYkrTQ7HfB5XxvAci7EWIzn7N4smWNveKk1MwMyX5sx9SSDloTGhUiYGXzKrPhwwb2ixqdPXLoxUOIEZDMQfKIToy6eH4bgk3BLuRm9ze2Y7U6oCyrHmBhzYuT49CxhLbkb+RR00lCUqCUAhzYlwDTdJBdsbbvHTtUApIIPkAQ1QcWxezeMXBqWsTcgGwyN8/YjK7QWkzLZKkjYu4UoC+Q4SW5tE1cDp3Znz6ZauF6nCWDXZgNrqbbLCNDscpVNdsWIYuFWNn2Yg+o2ETK05K1rIGXAcg/CoYbz/AEwLfZiB3dYsFKKzg3IsbeCYilbmlT2NfRLqq8T9S0Z+o0zEqsRxKAIcAsfvzg+zFkTSGzKSemVPb/dB9rHg8/oXjXmmTKIqMuaCJhSkcIADOTSyb+G8ZeskBZJSGWAKwU2UDvexw3QhsRr6S82Yf7rdAD+0P1unSU1uBS/1L/fjGcSpRbcM8tJlUju5gsXCVCySOTu4WCTfmPCA089KVLlzEl8KI3Gyxy3xuPONgaet0EOwdQ5cLn0cXjN1mh4QWAYMXGG/ENxn3xAmDKqQkrqpsWcM5b6ktuLm0Z+o0PEpJdlAhjcZqAs4Jznp0Mek7D0daVqZnNFJuAXBUx3GG9d72u0eyFGcSg02Ki+HBAzyOfWKSYm/Z4KTInaZaWWTcAZq4vhJf4geX1xHuuxu10zuFQomCxSTY9UHcdIzkaElRryCC5YkYPt+sI18pQmE4VZYIuASHqSSL3S7+MeizqKqP0PPe01NZ68IggiKvZvaKJoZwFj4k7+I5iNACOmrmSlHNdrFwxQRE0Q5o5oeYsBYREhMMAiWgyDAAJggmDAiQIWQ8QKYkJgwIJoMh4i6YIJg4mFkPECmJpg2joMggCmOhkRBkPEq/wATLD3AYXPIX3iU6kKDpUFpPK7kZYhxGOJAAYYAtt7vDqx9uPv78uWdIvzJzCpKi4GGDHz522ioe0yXS12zbh5ZDP8AYgX6i33n7844Yz9jxggJIR2str+F0sfHOIp9orE4grl4wRZQ8GLtj2zF8Ac/o33+sSEDk+OsGAZlVKzYEXG7F/P2vETNMVM77Hdxe2fvrF4zGFg0KmTSP+X9oHbQKtlWdUAwBd/i5th2/SLEjWimlmDAYL4Hht6RAnD7P7xw1HXw65H5QvGvY8/kTKUQpwpRAwHNuYfPlj8mK4xSonLg38n/AGgDPfA8ID+I8fLf7t6w/GhZsoarSTdlEv8AEz7Bw1ujftjQ1AeX3QuCk5erzJvc7+PKFKnH2vneGI1BbH39vC8aQ3cbFnViWSWPECTwGkG2SB0bzihNnsU0grQTSSASws4Va494brO05iSGQM+Nvy3ioO1Jii4lDyifGNVmvpeGXQM3ZvblawHlFwrKk3F0un2sfCMORqJz/wCknrn8hDdbNWBUVS/cK8wbxatPoh3EuQtTIZV7A4PV8RU1A7xJAKSpHwkXx8ST7W8RCz2sQbqT5f8A6gZnaZJtMKvBk+5Bi6dLX0TVqra5Zd0khphYMwDG1i37xYR2yxIMssN0kEv1SWb1jJm9q7BBNvmmFX0aK3/cpoNkJHViT6vHptaa7TwzzXNTaq5PXS9fKLcYBOAeE+DG8WHjxEvWahYNIURuwJHtBytVNbCjfYP7flHqVp9s8rurpHtXggY8YjVqHxpmW5hQPlt7GLY1aFC6FD/MeeIHbY1cTPUwQMeYMyQUgKMxLByR+vxQidq9KPmmAf8AuX6vUYWH+gef+k9eIIR42X3C3KZ9LfjWtPkAogmFBMp//UBQ3SFq9mNj6wYL2Gb9fc9xEiPDzZUu4TMa9gqeyvSkH2hi9CGFSJr/ANM13HP4A0GC9h5H6PatEtHzrUSL8KJgH9SyfekQ2Ro5ZH8xakHlnw+aK8S9/YnzOYj7n0Fo6Pmy9PLBYLm/4J/+yOg8S9/YPK/X3R65LFv0fa7wKQDu+2zC22/rCystYGw9ekcFKfzfqOnn+ZjlQdUaUeHX3Zm2iLflcN9YWhWLsenLYvEVczbLXcn8+flCgAibkcunjY8tvWOBff0iO83uanaxw3KOMy/QO5OHHRr49oICTlJNn59RuW8ce8LXK4mIDW9c4bG/iQIlU5sJJu6sA3e/I8oDvQCBuo26tULlmf8AeDcCVC4tk7BxjHq/l4iJPJ+uDvYbM1rj9YMEH5nLA+PI+H3eFEcJJUwv0a9mB6WuINwARMuwclgGbdvbbl72NRIyaWPh7PeAMu+epGRcv+tvCBEgCw5uzAM1nG/vyghjlDEL5Fw5+rWO28Qgjz6OB79GhIcOqk+r1B7Yzv1DxImF2azsThrbc8H1ENIRX1Omc8NQJ3yOVxf25RH8MUh1Em1zhvMXb9Yty1VDDHNjbeyuccEqpe4tuBt5wAIm6WYUsifMQ2EllD1PF7xh62VPSWVcc8Dlm941pmsJFlXfkxHrjeKk+vCnOzu/7dLxSuNdk1W0+UeenguxJHUjh8CRDFaOYkOQSDhQx+kaszsyYQ4HuPCxfpCkCagsyk7WdvXEbU6qpcmNWlpfBmiUo4L+aSIAoW7BL9en3vG6lSjvfmWMXBIURdKD/tb/AOMeq3fyXB5a9Pi+Ty4QRcyn8DYejvB963woXn5Tb1AjemaXkhIvdnJ9DFSZo7/KrpZJfbIc+UaeVL2Z+FspS5xBuid5G/5QxHad6T34HO5+piRpNqSlv7gP3/eORpHvdWWKQPo9toFcpq4YnaqXKORr0C9U1/7S/i8WEdoIayleYZj1G8I/h0vcqBFjUL/oINMlBbw/GB6hLRpBH0LtUgkEkl8ulLtfxfMNr0tJu48h6F8+kZhkJT8PC5Du49TTeOZI4SyjzYKbx39oePzDJejSr0r2DsWFS3v0BVj2iU6sVMAsNgiYzcyHxyilLlIZww5hm+u0LnoQfkHikY626xPjK8h6BOpVSAmZOZ91oVv+I+mWiiVz6lFWoShOUp7qWVPuLzGIttzMUpSLWUSMCln88wa1q2WrlcJ9mGP0iXaK8xE3U6gFv4mcf7dIG8PiEdCO/XvOSk8jSPD5+UdB4/mPy/I9Wbq32x74YtmDAvd7nBLAtu/kOW8IUUDdnyHZze/g0GCCyjS1/m8h7RyZOrA1Hh57FzhyXgBNDBTeNh6F4WoOTY7dXFiX6hyPtoFKiVG1uZJO7HwDcz+cAjpswkMLEhw4HAAzpNwS/QQRUag7sQMm4IbFsMbu36RLW9QApSlgCQXJbN8gD75KSoFQuAaQKXdHEc23yH5wDDWBwgh1NenASeGq6rjbJN/KJQuznINmekNYAGwVz5ekcqSbjrzIszMGLgvbzHhCUyjUM9XJKTgKAINsfbwAT3hYABlWJdwCrdiwZPUAeVo6eokikuKtxxFwylJD4Zxy9bDPLMhN0s6lq8XYpAww3ZyBfLqmS0rKksCniaW1zdioMXIxdibQAHMHEWFykUhiBVlKn2I3IvzgFlYLAsSb24UtlzkuEtbLwpFpXE4UkFSFEVFJVZwNgz2NwNtoJqqVlIZmmMaqwxJKn+QGws/JhkECJ7ikFihnUWUXIBdSRjnfxi1K1xoeYEy3BPDdyxKqnA2v5xSVKSqXLJSoUArlgFZVj4mPESHOQwfG8RppwWasrKWXLS6gFIPEwZ3FvXHIA0f4lKFKNcsLOUmlKjZ+d7EHzhOqmqVsb83bG0Z6NHLUqsKFBqIUk0qJBICWHxM55EHa8XdPNUqRVdwLg1bFvhLFm/OJaKKQmAkhSLYLsyh1HptDdLqgklFQcXpJwDcf8mHaWUmbJTMqDFIYhLAm7gB8eMZ+qC0HKSGyQSX2DC8S02NNGqdWnmn1ELmz0ncP7xkzNfLQwWlSXwzEHyizKWhRYKB8m/aNKFT2yasukWpU8kXY+Qgiocvy+kK7mBUkiOhTUoPBVS5DUrqfUxWnS33V6xy1GELmGG6kCpZXn6c8zFOhT/Er1J+sXlzTz9orqJ6RlUqTWmQpWpnpa6Vj8Kxb3cRqaFXfSis6cpILEy1BntYy1bMcgjMYvFEo1i0l3KTbiSOWxa/mXMJOOBOmeTXmaVkd4ipSXY03Iu10k2jPnrdzw2/Ehj6h4sytcFMZiAratC+7J6EHg3P2WgZ2lkk8M1UtTgUTUNfxFvpGtN59mFVn0UkTT+F+iZrj/EuD6QCZstJusoPLiHrSW9otanQzEf6kokfjSxHRiLP7xXnTSC7C+0xJFvI+8bKtMxdDRY/jElgFpJxclJGcFSTfwglagAMz7slQV53UH9IoLnpPxIHihR90E3ivMkpZ01JfoG8wWMVl6Jg0lqS95cz/ABP6xEZyUzAGTOUBsxWB6C0dBIHv5UxyWLi9KgHN755jwODyiVSBYDcsCNzknN/CK0mSCszKQW+HhsDkkEcStujNGkVqYi/RiGtzfffyjjwdoQqVnIGVJJS19yLknN94VJlrAaqzFIDAku7MwAGW8Lw0Luak8IwoOol+RIsfh5kvYNDZ05ieT3OC/wBeV75gARMnsQjwNgSMkuSWe/h6RMxakglWAWfNrWYfLnN7QCAQCbpu5AN2AYlw9WDkb7QifKc1FZa5sHd8lknAN8b+LgFiXMZKQpGbOCCkA3HVjawGYCfOSGewYBLBwSpgwSA7/u/KK+mUaCoqYBRoem4bIKiTublj5Wjuz5qCqYEppCmqBUlShWmogsrhx18oAOm6ZRIZR2pywpb4mPjl35xl6BOrQrvVFEy90gFmFkhKk+ZdsmNeWKaJRTUA4+JOfiFQ4UmwfY/WJSRLCU1JSo/CkJswYWTzPDvyDQAUdJNWZypgIW4wG/lkXbAzm4J63gO7E2UoALllRKl0llFjeoDhU4CMPveLOkS3eTFM2aSkBRI3O4s3Cb9cgVtcEgIQ1PeXKeILLgulJTYBlK6CowAWJ01S0CUkKSKAqsUkpYmymIZ6W4XtC9L2iVqCVhtkpY92s8T0qDFQyaT6QjS1SyeJS0FJ4ySoISkMku19/e52rdld7J1KZSFKmyyCayl0pN8KSWBtsN25sAaWj1aDMUFSlJKXYkJoYcPCQbB8AkflFmYCBUADgsG88D9cxmSpIExYlkLUZgKwRQpBJcGpr2cMzcWxcxbXMUlRVKS9Nl5BcDiSEsxv15wmhldWtURQAWuzMLeBH20VV6h6SocVxzAcmpwNhcvnwxFvsqdKIXWlQUpTlMxRUXZzSVFhsWTh9oM6BSwVJUMkUq4lNydnJti+bPutx7GFPNSgbNhvBgcZv9bu0HpqQLYPPd7Ew9c1SFFMyTzZSS4OwJH3fwidLq5KntSUqwpsWILhwQdnY9IlyNQLGpWFOgny3izJ7VVhQfqzEflzi13aTdP1ce3jAnTnmPSClPoVTXYadakx1STCDowcEQJ0Chg+8eqh3FzueepW3xsOXKTCFyB0ge4mDr9+MQUr5RrkyMUAuQnlFZUkG4PvD5iDyPp+8IVL/u9Il1DSB00hFTOpyMOB6WL+v0jTQmtFEwAgWdw4y2/20ZSpT7E+f5QoyrWceZ+mIUjg1NKCAlIFSS+4Cg9mckhsm7w+Zp0gUkhsjvOEt/SSwI+7RjonTB1BvuL+IMGrUkCniHLCm9YeZDtlg6UqLIllV24WU3+D+/I8oXNkqRxFku3EKkkPYBRTYcmVGdSXJQoepBjUkduqAp1CV2BAmJYqOWqqJqA97xdN59mbslAzFizSz1v+Vo6NNGu0jXKH/smpfkWFg+Y6NPKjPxM9FMnFKBWyAS1rpN0tcAXU7bXO8PkzkrlB0pCWAUFM4LMxGHsQTiKa9WVzqUKDJIKgXA4qlBIuxUQk+DA7w7vUOKCkqJUH/wDIpfYZPlvHPOiCKgsJQopS1wKTa5LNjBDZ8Gi7qVj5WUXaoM4AqUx3VcD7eKOikZ4iFtY3LXdyT8zJxs/lBTprCsJEwvwvySTizu5IFr28wZ2oQoXSglRcOS2SS3GwIJOz7ZtBaehX8wgKW5wWuyQds2I9ntE6wqCCsKYNepQSGFzxXZw/u7RSr7xJXLFCwHZYZTNWVpJ+IsLDoesABypqq1d6CEB2UQkJNtmzdv8Ay5RMjTkAoUKhkqKgwDlk0EdWdsc2hiVS5igSU1JDODguC5w5Zjj5jhoUjUBZQDVVXZKkkKsVJFRAx4tzOWgAUFKVNrQeFJUFCoNUnCSDZJcEYsSCTBzZ6BPCHNSwQQEg2chQL2SCCPQdYXr9Z3QKwyQS1LgIL2zRclmcdOjrm9nImkKqWkpYjulBnNJJWW4iGa34dnYAFjUkS5SVTOMu1IuSRcF1EM1r22L7QtEycpYYpmS1EngqBABsgEHzd79IrztYCvu1qWFI+cps5BNNRTSCAyXZ2beNCWsplkKAFjgClT5BwPlIubWgAztYtUwJRKJlgGlaCzpQm/DS7i4Gd8BoZOZHDINANJUElzTggIN0/ESSzCk4hOrS89BlFQlpZailRSlSmSzmm+VWqDedrGu06BM7+lpibVFKXuUvkOclgcMSxxABWmzu+llWlUETArKjSmrLrs43yMxGt1CJXdpnAoWsjvFyQKVqAAUVtch3Dv8AKdg0XdW5kqXLliYsFNQBSlTpILErsQL3OeUBp9eiaCVmlSCKkkkFLAjjI+IcRc7CnMAGbrdWpE3uZklfdu0uZLcpU5sRSeEsWy/SNftBakoHdsV8PC5NR2UVMCQOvhewNQ6lSVkTkmUMBVjLWCAwrA4c9PiB2g5U6pSkkEMQkOlVJDJwsuFJJvYt53gALS6srCRPQEKILXSQcvxg5HOxI5RV7W7NqekcW5SAPmdmVYh7XD3frCP+p5ktBFRCVzGoBcBe6QcuQebO/INGnopzyihjZIKWvUhgxGxLjHUcnhDMQoUm5+EeLvYXSLgbv13wbEpczuwtKiRfL1cyL7hueDD56gSo0uyTbZdO4I+JgSOnE1xCuztShYMtAWigqBQpBBJ/pUBxXDWfbxhbBuQjtEuyg+L4Jz+nTaLMvWpPMfvYRQ1OnJNXhdzdnz0JYXB3yYQTw3L56OAcgbWs9tubwJtcA0nybiJoOFD6Qauvrt6iPPknfkC1ycE5PWFd8pPwEgW+px7RavVIh2qWekp84BSOkYcntNYsoH+693G4b6Rc/wC5Hcb+vrGqvrtEOw+mWlygdvpClyvstHJ1oMENQkxorlLM3bqQgp8vIQBBGyS/9If1a0Wix+xFeagDf78obaEkyvMlJOR9frCwmlyn3Jb0doYZrbkxAmvs58BjneCUxwysntEfglHOQxzyjouuv8J+/GOhR8w+hvTZEw4VQbqdid2SSHsWAHn4gu0E1M8MGVSzrayiCRd+qWdzyfeOjo83R6BkvUkmhQIDhiDk8i21me7+cLQviBBqJawJs5pAa4YXB3t1jo6EMXNlKQvvVziQyEhADAXupI62AfH1eVLQmopSXCSkOxL/AA7OCxL2t9JjoYFEJT3qu8l1OohixC5aQQlx8pJa5/CReA7Rn3RKSoSVKLpoUnkVl3FkkE3bIvfPR0CDgLVIWlINSZ5StSQVoZThlGkgWtwu3ynLEQ8pEqoLASuxqA4XNQZLYFixIzszA9HQgMns2aZ00rVSCHCqVEpUlIcObJLFRfD0kF40ZWvQrUTNPZkJHCEkAJKASSQDcG2xxYm8dHQ+w6kpduyZslFUod5Vw8IenADKSATgpc9bZi/2NPM7TtQUgBLVpwqkWB5NzHzWcMI6Og6F2DpBK08hctEtihXGPmdQdJqUWJUFp3s7bNFHs/Qo71c1aFS5hAeplFm+UbuGBN8E2d46OhMFuXlisFCxwmoFIAFSVVEEMAQWCCAL7h8mhI0FCVyCGlfElVZK0m7qBP8AeEt57iIjoOBlfvKpQkzCVqoZyySp0uw2BakAHl5GdNNKALuXCEuX4bCkkfiAS27kDa8x0SUW9dLBZJD3fDK2LMnKrEE9X5MMuUgOEBJPCVJsMsFLS+HIS4Db4JMdHQgFrC8k78sPbPjbw5QmZpVAMbuwzu4uzXLD3POOjoSY2Vp+jXg55ku9uZ3zzyPCCGkY3bw5Zx6n7EdHQ1uIBWl8T5nHIvf79FmUx++l46OisRZApmU4Gx5t7HP6w3vuYb12/Lf7v0dF0oh1B950v4kevVoleowGbwu9+b5jo6NCAP4pXQeAF7Py6+MLmzy1yTk5+xyiY6CQgQZ3M38Ex0dHQSI//9k='
    }
    const convertArray = (myList) => {
        setTripVisible(false);
        let tempArr = [];
        for (let i = 0; i < myList.length; i++) {
            const element = myList[i];
            const dateFrom = new Date(element.FromHour)
            const dateTo = new Date(element.ToHour)
            const newDate = new Date(dateTo.getTime() - dateFrom.getTime());
            const duration = newDate.getHours() + ":" + newDate.getMinutes() + ":00";
            const obj = {
                'start': element.FromHour,
                'duration': duration,
                'note': <Text style={{ color: '#66a3ff', fontWeight: 'bold' }} onPress={() => abcd(element)}>{element.AttractionName}</Text>
            }
            tempArr.push(obj);
        }
        setEvents(tempArr)
        setTripVisible(true);
    }
    if (MapVisible) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Feather style={{ position: 'absolute', left: 10, top: 40 }} name='x' size={28} color='#000000' onPress={() => setMapVisible(false)} />
                <MapView
                    style={{ flex: 0.8, width: Dimensions.get('window').width }}
                    region={{
                        latitude: currentElement.lat,
                        longitude: currentElement.lng,
                        latitudeDelta: 1.122,
                        longitudeDelta: 1.121,
                    }} >
                    <Marker
                        coordinate={{
                            latitude: currentElement.lat,
                            longitude: currentElement.lng
                        }}
                        title={currentElement.AttractionName}
                        description={currentElement.Address}
                    />
                </MapView>
            </View>

        );
    } else if (events.length > 0 && TripVisible) {
        return (
            <View style={styles.container}>
                {modalVisible ? showModal(currentElement) : null}
                <ImageBackground
                    source={image}
                    style={{ width: '100%', height: 270 }}
                    imageStyle={{ borderBottomRightRadius: 65 }}
                >
                    <View style={styles.MainContainer}>
                        <Text style={styles.UserGreet}>My Israel Trip</Text>
                    </View>
                </ImageBackground>
                <View>
                    <WeeklyCalendar themeColor={'#66a3ff'} events={events} style={{ height: 400 }} />
                </View>


            </View>
        )
    }
    else if (events.length == 0) {
                let message = 'Your trip is not ready yet!';

        return (
            <WatingToTrip message={message} />
        );
    }
    else {
        return (
            <ActivityIndicator
                animating={true}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',

                    height: 80
                }}
                size="large"
            />
        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 50

    },
    MainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10

    },
    UserGreet: {
        fontSize: 38,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 100
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: 300,
        height: 500,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalText: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold'
    },
    modalMainText: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
        fontSize: 12,
    },
    viewProgress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default myTrip;
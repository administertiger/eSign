import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Modal, Dimensions, Button } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { useTranslation } from 'react-i18next';

function DocumentsScreen({ navigation }) {
    const API_URL = 'https://ws.esigns.cloud';

    const { t, i18n } = useTranslation();

    useEffect(() => {
        //handleAuthorize(Configs.adb2c);
        getList();

    }, []);

    //-----------------------Get & Limit list items---------------------
    const [documents, setDocuments] = useState([]);
    const [itemCount, setItemCount] = useState(9);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFileInfo, setSelectedFileInfo] = useState({});
    const [fileUri, setFileUri] = useState('')

    //Modal
    const [infoModal, setInfoModal] = useState(false);
    const [showPdf, setShowPdf] = useState(false)

    function getList() {

        axios.get(API_URL + '/documents', //Documents API
            {
                headers: {
                    'Authorization': 'Bearer ' + global.token
                }
            })
            .then((response) => {
                console.log('response = ', response);
                if (response.data) {
                    //console.log('Documents List: ', response.data);

                    const data = response.data;
                    const getFile = data.map((data) => data); //Get file data
                    const getCertificate = data.map((data) => data.signatures[0]);  //Get certification

                    //Merge File docs array and Certification array togethor.
                    const merge = getFile.map((a, i) => Object.assign({}, a, getCertificate[i],))
                    console.log('documents = ', merge)
                    setDocuments(merge);
                }

            }, (error) => {
                console.log(error);
            })
    }

    function handleLoadMore() {
        const addNumber = 10;

        if (itemCount < documents.length) {
            setItemCount(itemCount + addNumber);
            console.log('count = ', itemCount)
            console.log('isLoading = ', isLoading)
        } else if ((itemCount + addNumber) >= documents.length) {
            console.log("You've reached the end!!")
            console.log('isLoading = ', isLoading)
            setIsLoading(false);
        }
    }

    function renderFooter() {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='black' animating={isLoading} />
            </View>
        )
    }

    //-----------------------Handle download------------------------
    function handleDownload(item) {

        //Get file name without extension (.pdf)
        let filename = ''
        const name = item.file.displayName;
        for (let i = 0; i < name.length - 4; i++) {
            //console.log('i = ', i)
            //console.log('letter = ', name[i])
            filename += name[i];
            //console.log('filename =', filename)
        }

        const { fs } = RNFetchBlob
        let DownloadDir = fs.dirs.DownloadDir // this is the Downloads directory.
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, //uses the device's native download manager.
                notification: true,
                title: item.file.displayName, // Title of download notification.
                path: DownloadDir + '/' + filename + "." + item.file.extension, // this is the path where your download file will be in
                description: 'Downloading file.',

            }
        }
        RNFetchBlob.config(options)
            .fetch('GET', "https://ws.esigns.cloud/files/" + item.id, { 'Authorization': 'Bearer ' + global.token, })
            .then((res) => {
                console.log("Success = ", res);
            })
            .catch((err) => { console.log('error', err) }) // To execute when download cancelled and other errors
    }
    //----------------------toggle modal-------------------------
    function toggleModal(item) {
        const createDateFormat = item.createdTime[8] + item.createdTime[9] + '/' + item.createdTime[5] + item.createdTime[6] + '/' + item.createdTime[0] + item.createdTime[1] + item.createdTime[2] + item.createdTime[3]
        const createTimeFormat = item.createdTime[11] + item.createdTime[12] + item.createdTime[13] + item.createdTime[14] + item.createdTime[15] + item.createdTime[16] + item.createdTime[17] + item.createdTime[18]

        setSelectedFileInfo({ 'fileName': item.file.displayName, 'fileSize': Math.ceil(item.file.size / 1000), 'lastModified': item.file.lastModified, 'certificate': item.certificateName, "createDate": createDateFormat, "createTime": createTimeFormat });

        setInfoModal(true);
    }

    //----------------------------Show PDF-----------------------------

    const ShowPdf = () => {

        const source = { uri: "data:application/pdf;base64," + fileUri };

        return (
            <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                    //setTotalPage(numberOfPages);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`current page: ${page}`);
                    //setCurrentPage(page);  //set the cuurentPage
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link presse: ${uri}`)
                }}
                style={styles.pdf} />
        )
    }

    function getBlob(item) {
        RNFetchBlob.fetch('GET', "https://ws.esigns.cloud/files/" + item.id, { 'Authorization': 'Bearer ' + global.token, })
            .then((res) => {
                console.log("Success = ", res);
                setFileUri(res.data);
            })
            .catch((err) => { console.log('error', err) }) // To execute when download cancelled and other errors
    }

    function handleShowPdf(item) {
        getBlob(item);
        setShowPdf(true);
    }

    function closeShowPdf() {
        setShowPdf(false);
        setFileUri('');
    }

    //----------------------Render Items---------------------------

    function RenderItem({ item }) {
        return (
            <View>

                <TouchableOpacity style={styles.listBox} onPress={() => toggleModal(item)}>
                    <View>
                        <Text numberOfLines={1} style={styles.listText}>{item.file.displayName}</Text>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.5)' }}>{item.certificateName}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', right: 30, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>

                    <TouchableOpacity onPress={() => handleShowPdf(item)}>
                        <IconFeather name='search' color='black' size={25} />
                    </TouchableOpacity>
                    <Text>       </Text>
                    <TouchableOpacity onPress={() => handleDownload(item)}>
                        <IconFeather name='download' color='black' size={25} />
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
    //-------------------------------------------------------------

    return (
        <View style={styles.box}>
            {/* Detail modal */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={infoModal}>
                <View style={styles.informationContainer}>
                    <View style={styles.informationBox}>
                        <Text style={{ fontSize: 20, textAlign: 'center', paddingVertical: 10 }}>{selectedFileInfo.fileName}</Text>
                        <View style={styles.detailBox}>
                            <Text style={styles.headerDetail}>{t('File size')}: </Text>
                            <Text style={styles.detail}>{selectedFileInfo.fileSize} kb</Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.headerDetail}>{t('Create date')}: </Text>
                            <Text style={styles.detail}>{selectedFileInfo.createDate}</Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.headerDetail}>{t('Create time')}: </Text>
                            <Text style={styles.detail}>{selectedFileInfo.createTime}</Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.headerDetail}>{t('Certificated by')}: </Text>
                            <Text style={styles.detail}>{selectedFileInfo.certificate}</Text>
                        </View>
                        <View style={{ paddingVertical: 10 }}>
                            <Button title='         OK         ' onPress={() => setInfoModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Show pdf modal */}
            <Modal
                animationType='slide'
                transparent={false}
                visible={showPdf}>
                <View style={{ flex: 1 }}>
                    <Button title='Close' onPress={() => closeShowPdf()} />
                    <ShowPdf />
                </View>
            </Modal>
            <Text style={styles.header}>{t('Your documents')}</Text>
            <FlatList
                data={documents.slice(0, itemCount)}
                renderItem={RenderItem}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0} />
        </View>

    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        //paddingHorizontal: 10,
        marginBottom: 55,
        //justifyContent: 'center',
        //borderWidth: 1,
        alignItems: 'center'
    },
    listBox: {
        //borderWidth: 1,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 15,
        width: Dimensions.get('window').width - 40,
        backgroundColor: 'white',
        elevation: 3,
        paddingRight: 100
    },
    listText: {
        //width: 220,
        fontSize: 25,
        fontFamily: 'Verdana',
        paddingRight: 10,
    },
    header: {
        textAlign: 'center',
        paddingVertical: 15,
        fontSize: 25,
        //fontWeight: 'bold',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    //------------Modal-------------
    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    informationBox: {
        width: Dimensions.get('window').width - 30,
        //height: 260,
        //borderWidth: 1,
        backgroundColor: 'white',
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    detail: {
        color: 'black',
        opacity: 0.5,
        fontSize: 15,
        //width: Dimensions.get('window').width - 30,
        textAlign: 'center',
        //borderWidth: 1,

    },
    detailBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        //borderWidth: 1,
        paddingHorizontal: 10,
    },
    headerDetail: {
        color: 'black',
        fontSize: 16,
        //padding: 5
    },
})

export default DocumentsScreen;
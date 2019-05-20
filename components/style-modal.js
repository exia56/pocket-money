import React, { Component } from 'react'
import { StyleSheet, Modal, TouchableWithoutFeedback, Text } from 'react-native'
import { View, Spinner } from 'native-base';

import AppStyle from '../constants/app-style';
import PositiveButton from './positive-button';

type Props = {
  contentStyle: Style,
  visible: Boolean,
  caption: String,
  spinnerVisible: Boolean,
  btnVisible: Boolean,
  btnText: String,
  onButtonPress: () => {},
  onReturnPress: () => {},
  onOutsidePress: () => {}
}
export default class StyleModal extends Component<Props> {
  constructor(props) {
    super(props);
    this.props.onOutsidePress = props.onOutsidePress || (() => { });
    this.props.onReturnPress = props.onReturnPress || (() => { });
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.onRequestClose}>
        <TouchableWithoutFeedback onPress={this.onOutsidePress}>
          <View style={styles.model}>
            <View style={[styles.modelContent, this.props.contentStyle]}>
              {this.props.spinnerVisible ? < Spinner color="black" /> : undefined}
              {this.props.caption ? <Text style={styles.modalText}>{this.props.caption}</Text> : undefined}
              {this.props.btnVisible ?
                (<PositiveButton
                  style={styles.modalBtn}
                  onPress={this.onButtonPress}
                  caption={this.props.btnText} />) : undefined}

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
  onButtonPress = () => {
    if (this.props.onButtonPress)
      this.props.onButtonPress();
  }
  onRequestClose = () => {
    if (this.props.onReturnPress)
      this.props.onReturnPress();
  }
  onOutsidePress = () => {
    if (this.props.onOutsidePress)
      this.props.onOutsidePress();
  }
}

const styles = StyleSheet.create({
  model: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000088",
    flex: 1,
    paddingHorizontal: 20
  },
  modelContent: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // minWidth: 200
  },
  modalText: {
    // flex: 1,
    fontSize: AppStyle.mainFontSize,
    color: AppStyle.mainFontSize
  },
  modalBtn: {
    alignSelf: "stretch",
    marginTop: 45,
    padding: 12,
    color: AppStyle.mainFontColor
  }
})
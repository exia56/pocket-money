import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  onFocus: () => {},
  onBlur: () => {}
}
type State = {
  isFocus: Boolean
}

export interface IFocusableInput {
  focus: () => {},
  blur: () => {}
}

export default class FocusableInput extends Component<Props, State> implements IFocusableInput {
  state = {
    isFocus: false
  }
  render() {
    return (
      <View
        style={StyleSheet.flatten([styles.wrapper, styles.input, this.state.isFocus ? styles.focus : {}, this.props.style])}>
        {this.props.children}
      </View>
    )
  }

  focus = () => {
    this.setState({ isFocus: true });
    this._onFocus();
  }

  blur = () => {
    this.setState({ isFocus: false });
    this._onBlur();
  }

  _onFocus = () => {
    if (this.props.onFocus)
      this.props.onFocus();
  }
  _onBlur = () => {
    if (this.props.onBlur)
      this.props.onBlur();
  }
}

export const createFocusable = (V) => {
  class Focusable extends V implements IFocusableInput {
    state = {
      isFocus: false
    }
    render() {
      const { style, onPress, ...othetProps } = this.props;
      return <V
        {...othetProps}
        style={StyleSheet.flatten([styles.input, style, this.state.isFocus ? styles.focus : {}])} >
        {this.props.children}
      </V>
    }

    focus = () => {
      this.setState({ isFocus: true });
      this._onFocus();
    }

    blur = () => {
      this.setState({ isFocus: false });
      this._onBlur();
    }

    _onFocus = () => {
      if (this.props.onFocus)
        this.props.onFocus();
    }
    _onBlur = () => {
      if (this.props.onBlur)
        this.props.onBlur();
    }

  }
  return Focusable;
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    flexDirection: "row"
  },
  input: {
    borderBottomColor: "#333333",
    borderBottomWidth: 1
  },
  focus: {
    borderBottomColor: "#0f0fff",
    borderBottomWidth: 1
  }
})
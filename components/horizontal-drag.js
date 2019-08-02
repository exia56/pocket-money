import React, { Component } from 'react'
import { View, FlatList, Platform } from 'react-native';

// import AppStyle from '../constants/app-style';

type Props = {
  data: Array,
  flex: Boolean,
  horizontal: Boolean,
  onSwipe: (direction: String) => {},
  onSwipeEnd: (index: Number) => {},
}
type State = {
  width: Number,
  height: Number,
  startPoint: Number,
  offset: Number,
}
export default class HorizontalDrag extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.flatList = React.createRef();
  }

  state = {
    width: 0,
    height: 0,
    startPoint: NaN,
    offset: 0,
  }

  _CellRendererComponent = (data) => {
    const { index, children } = data;
    const { width, height } = this.state;
    return (
      <View style={{ width, height }}>
        {children}
      </View>);
  }

  _onScrollEndDrag = (event) => {
    const { width, height, startPoint, offset } = this.state;
    const { x, y } = event.nativeEvent.contentOffset;
    const target = this.props.horizontal ? x : y;
    const diff = (this.props.horizontal ? width : height) * .5;
    if (Math.abs(startPoint - target) > diff) {
      this.flatList.current.scrollToIndex({ animated: true, index: 1 + offset, viewOffset: 0 });
      this.onSwipeEnd();
    } else {
      this.flatList.current.scrollToIndex({ animated: true, index: 1, viewOffset: 0 });
    }
  }

  _onScroll = (event) => {
    const { startPoint, offset } = this.state;
    const { x, y } = event.nativeEvent.contentOffset;
    const target = this.props.horizontal ? x : y;
    if (Number.isNaN(startPoint)) return;

    if (target > startPoint && offset !== 1) {
      this.onSwipe(1);
    }
    else if (target < startPoint && offset !== -1) {
      this.onSwipe(-1);
    }
  }

  _onScrollBeginDrag = (event) => {
    const { horizontal } = this.props;
    const { x, y } = event.nativeEvent.contentOffset;
    this.setState({ startPoint: horizontal ? x : y })
  }

  _getItemLayout = (data, index) => {
    const target = this.getTarget();
    return {
      length: 3,
      offset: target * index,
      index,
    };
  }

  _keyExtractor = (item, idx) => idx + '';

  _renderItem = (i) => {
    const { item, index } = i;
    return item;
  }

  onSwipe = async (offset) => {
    if (offset !== this.state.offset && this.props.onSwipe) {
      await Promise.all([
        new Promise((resolve, reject) => {
          this.setState({ offset }, resolve);
        }),
      ]);
      this.props.onSwipe(offset);
    }
  }
  getTarget = () => {
    const { width, height } = this.state;
    return this.props.horizontal ? width : height;
  }

  _to = async (offset) => {
    await this.onSwipe(offset);
    this.flatList.current.scrollToIndex({ animated: true, index: 1 + offset, viewOffset: 0 });
    this.onSwipeEnd();
  }

  next = () => {
    this._to(1);
  }

  previous = () => {
    this._to(-1);

  }

  onSwipeEnd = async () => {
    const { offset } = this.state;
    this.setState({ offset: 0, startPoint: NaN });
    setTimeout(async () => {
      if (this.props.onSwipeEnd) await this.props.onSwipeEnd(offset);
      this.flatList.current.scrollToIndex({ animated: false, index: 1, viewOffset: 0 });
    }, 100);
  }

  render() {
    const { data } = this.props;
    const { width, height } = this.state;
    if (!!data[1] && !!width)
      return (
        <FlatList
          style={{ width, height }}
          initialScrollIndex={1}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}

          ref={this.flatList}
          horizontal={this.props.horizontal}
          data={this.props.data}

          CellRendererComponent={this._CellRendererComponent}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
          onTouchStart={this._onTouchStart}
          onScroll={this._onScroll}
          onScrollBeginDrag={this._onScrollBeginDrag}
          onScrollEndDrag={this._onScrollEndDrag}>
        </FlatList >
      )
    else
      return (
        <View
          style={this.props.flex ? { flex: 1 } : {}}
          onLayout={(event) => { this.setState(event.nativeEvent.layout) }} >
          {data[1]}
        </View>
      )
  }
}

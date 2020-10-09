import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const WeeklyTraining = (props) => {
  const [currDate, setCurrDate] = useState(moment(props.selected).locale('da'));
  const [weekdays, setWeekdays] = useState([]);
  const [weekdayLabels, setWeekdayLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currDate.clone());
  const [isCalendarReady, setCalendarReady] = useState(false);
  const [pickerDate, setPickerDate] = useState(currDate.clone());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [eventMap, setEventMap] = useState(undefined);
  const [scheduleView, setScheduleView] = useState(undefined);
  const [dayViewOffsets, setDayViewOffsets] = useState(undefined);
  const scrollViewRef = useRef();

  //UseEffect to update component every time props changes
  useEffect(() => {
    createEventMap(props.events);
    setCalendarReady(true);
  }, [props.events]);

  //Method to add events to component
  const createEventMap = (events) => {
    let dateMap = new Map();

    for (let i = 0; i < events.length; i++) {
      let eventDate = moment(events[i].timeStamp)
        .format('DD-MM-YYYY')
        .toString();
      if (dateMap.has(eventDate)) {
        let eventArr = dateMap.get(eventDate);
        eventArr.push(events[i]);
        dateMap.set(eventDate, eventArr);
      } else {
        dateMap.set(eventDate, [events[i]]);
      }
    }
    setEventMap(dateMap);
    createWeekdays(currDate, dateMap);
  };

  //Method to create week days (Weekly schedule) view
  const createWeekdays = (date, map) => {
    let dayViews = [];
    let offsets = [];
    setWeekdays([]);

    //For loop which makes item (view) for each day
    for (let i = 0; i < 7; i++) {
      //showing week day date and label for each day
      const weekdayToAdd = date.clone().weekday(props.startWeekday - 7 + i);
      setWeekdays((weekdays) => [...weekdays, weekdayToAdd]);
      setWeekdayLabels((weekdayLabels) => [
        ...weekdayLabels,
        weekdayToAdd.format(props.weekdayFormat),
      ]);

      // Render schedule view
      let events = map.get(weekdayToAdd.format('DD-MM-YYYY').toString());
      let eventViews = [];
      //If there are some events for current day
      if (events !== undefined) {
        if (props.renderEvent !== undefined) {
          eventViews = events.map((event, j) => {
            if (props.renderFirstEvent !== undefined && j === 0)
              return props.renderFirstEvent(event, j);
            else if (
              props.renderLastEvent !== undefined &&
              j === events.length - 1
            )
              return props.renderLastEvent(event, j);
            else return props.renderEvent(event, j);
          });
        } else {
          //Using .locale method with params "da" for displaying dateTime format in danish
          moment.locale('da');
          //Mapping events array for current day and displaying them all
          eventViews = events.map((event, j) => {
            //Getting the start of event
            let startTime = moment(event.timeStamp).format('LT').toString();
            //Getting duration string for checking
            let durationString = event.duration;
            //Getting the duration HH:mm:ss
            let duration = event.duration.split(':');
            //Parsing duration to seconds
            let seconds =
              parseInt(duration[0]) * 3600 +
              parseInt(duration[1]) * 60 +
              parseInt(duration[2]);
            //Adding seconds to start time to get finish time
            let endTime = moment(event.timeStamp)
              .add(seconds.toString(), 'seconds')
              .format('LT')
              .toString();
            //Returning the view with event timestamps and notes
            return (
              <View key={i + '-' + j}>
                <View style={styles.event}>
                  {/* If duration is empty then show only start time else show start time and finish time */}
                  {durationString === '00:00:00' ? (
                    <View style={styles.eventDuration}>
                      <View style={styles.durationContainer}>
                        <View style={styles.durationDot} />
                        <Text style={styles.durationText}>{startTime}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.eventDuration}>
                      <View style={styles.durationContainer}>
                        <View style={styles.durationDot} />
                        <Text style={styles.durationText}>{startTime}</Text>
                      </View>
                      <View style={{paddingTop: 10}} />
                      <View style={styles.durationContainer}>
                        <View style={styles.durationDot} />
                        <Text style={styles.durationText}>{endTime}</Text>
                      </View>
                      <View style={styles.durationDotConnector} />
                    </View>
                  )}

                  {/* Event note is clickable */}
                  <TouchableOpacity
                    style={styles.eventNote}
                    onLongPress={() =>
                      props.editEvent(event.id, event.exercises.name)
                    }
                    onPress={() =>
                      props.seeEvent(event.id, event.exercises.name)
                    }>
                    <Text style={styles.eventText}>{event.exercises.name}</Text>
                    {/* If event is completed then show "check" icon */}
                    {event.isComplete ? (
                      <Icon
                        name="check"
                        size={24}
                        color={'green'}
                        style={styles.icon}
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
                {/* Showing a line seperator (1 px line) at the end of each event */}
                {j < events.length - 1 && <View style={styles.lineSeparator} />}
              </View>
            );
          });
        }
      }

      let dayView = undefined;
      if (props.renderDay !== undefined) {
        if (props.renderFirstDay !== undefined && i === 0)
          dayView = props.renderFirstDay(eventViews, weekdayToAdd, i);
        else if (props.renderLastDay !== undefined && i === 6)
          dayView = props.renderLastDay(eventViews, weekdayToAdd, i);
        else dayView = props.renderDay(eventViews, weekdayToAdd, i);
      } else {
        dayView = (
          //View that is to the left and shows date and day label (ddd) for each day
          <View
            key={i.toString()}
            style={styles.day}
            onLayout={(event) => {
              offsets[i] = event.nativeEvent.layout.y;
            }}>
            <TouchableOpacity
              style={styles.dayLabel}
              onPress={() => props.addEvent(weekdayToAdd.format('YYYY-MM-DD'))}>
              <Text style={[styles.monthDateText, {color: props.themeColor}]}>
                {weekdayToAdd.format('D/M').toString()}
              </Text>
              <Text style={[styles.dayText, {color: props.themeColor}]}>
                {weekdayToAdd.format(props.weekdayFormat).toString()}
              </Text>
            </TouchableOpacity>
            {/* View that holds timestamps and notes and if there is no event it is just grey color*/}
            <View
              style={[
                styles.allEvents,
                eventViews.length === 0
                  ? {width: '100%', backgroundColor: 'lightgrey'}
                  : {},
              ]}>
              {eventViews}
            </View>
          </View>
        );
      }
      dayViews.push(dayView);
    }
    setScheduleView(dayViews);
    setDayViewOffsets(offsets);
  };

  //Method for showing last week and it events
  const clickLastWeekHandler = () => {
    setCalendarReady(false);
    const lastWeekCurrDate = currDate.subtract(7, 'days');
    setCurrDate(lastWeekCurrDate.clone());
    setSelectedDate(lastWeekCurrDate.clone().weekday(props.startWeekday - 7));
    createWeekdays(lastWeekCurrDate.clone(), eventMap);
    setCalendarReady(true);
  };

  //Method for showing next week and events
  const clickNextWeekHandler = () => {
    setCalendarReady(false);
    const nextWeekCurrDate = currDate.add(7, 'days');
    setCurrDate(nextWeekCurrDate.clone());
    setSelectedDate(nextWeekCurrDate.clone().weekday(props.startWeekday - 7));
    createWeekdays(nextWeekCurrDate.clone(), eventMap);
    setCalendarReady(true);
  };

  //Method to select todays year, month and date
  const isSelectedDate = (date) => {
    return (
      selectedDate.year() === date.year() &&
      selectedDate.month() === date.month() &&
      selectedDate.date() === date.date()
    );
  };

  //Method used to invoke date picker and pick date
  const pickerOnChange = (_event, pickedDate) => {
    if (Platform.OS === 'android') {
      setPickerVisible(false);
      setLoading(true);
      if (pickedDate !== undefined) {
        // when confirm pressed
        setTimeout(() => {
          let pickedDateMoment = moment(pickedDate).locale('da');
          setPickerDate(pickedDateMoment);
          confirmPickerHandler(pickedDateMoment);
          setLoading(false);
        }, 0);
      } else setLoading(false);
    } else setPickerDate(moment(pickedDate).locale('da'));
  };

  //Method used to confirm picked date in datePicker
  const confirmPickerHandler = (pickedDate) => {
    setCurrDate(pickedDate);
    setSelectedDate(pickedDate);

    setCalendarReady(false);
    createWeekdays(pickedDate, eventMap);
    setCalendarReady(true);

    setPickerVisible(false);
  };

  //Method used to scroll to the day picked on top bar (day, date)
  const onDayPress = (weekday, i) => {
    scrollViewRef.current.scrollTo({y: dayViewOffsets[i], animated: true});
    setSelectedDate(weekday.clone());
    if (props.onDayPress !== undefined) props.onDayPress(weekday.clone(), i);
  };

  //Method used to set formating on displaying title (month and year at the very top in middle)
  const displayTitleByLocale = (selectedDate, format) => {
    if (format !== undefined) return selectedDate.clone().format(format);

    return selectedDate.clone().format('MMMM YYYY');
  };

  return (
    <View style={[styles.component, props.style]}>
      {/* Header view that holds 3 touchables - 2 arrows and title*/}
      <View style={styles.header}>
        {/* TouchableOpacity that has an arrow and calls method to go to last week */}
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={clickLastWeekHandler}>
          <Text style={{color: props.themeColor}}>{'\u25C0'}</Text>
        </TouchableOpacity>
        {/* TouchableOpacity that has an title and calls method to open datePicker */}
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <Text style={[styles.title, props.titleStyle]}>
            {isCalendarReady &&
              displayTitleByLocale(selectedDate, props.titleFormat)}
          </Text>
        </TouchableOpacity>
        {/* TouchableOpacity that has an arrow and calls method to go to next week */}
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={clickNextWeekHandler}>
          <Text style={{color: props.themeColor}}>{'\u25B6'}</Text>
        </TouchableOpacity>
      </View>
      {/* View (bar) unnder title and 2 arrows that has week days labels ('ddd' format) and dates*/}
      <View style={styles.week}>
        {/* View that holds all labels */}
        <View style={styles.weekdayLabelContainer}>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[0] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[1] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[2] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[3] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[4] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[5] : ''}
            </Text>
          </View>
          {/* View that has text which display week day label in ddd format*/}
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[6] : ''}
            </Text>
          </View>
        </View>

        {/* View that holds all dates for each day and are touchable */}
        <View style={styles.weekdayNumberContainer}>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[0], 0)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[0])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[0])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[0].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[0].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[0])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[1], 1)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[1])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[1])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[1].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[1].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[1])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[2], 2)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[2])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[2])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[2].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[2].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[2])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[3], 3)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[3])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[3])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[3].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[3].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[3])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[4], 4)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[4])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[4])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[4].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[4].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[4])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[5], 5)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[5])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[5])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[5].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[5].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[5])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
          {/* TouchableOpacity that has a date number and dot under it if there are events for that day*/}
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[6], 6)}>
            {/* View that has a number and background color and number color changes depending on is it clicked or if today is this day*/}
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[6])
                  ? [
                      styles.weekDayNumberCircle,
                      {backgroundColor: props.themeColor},
                    ]
                  : {}
              }>
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[6])
                    ? styles.weekDayNumberTextToday
                    : {color: props.themeColor}
                }>
                {isCalendarReady ? weekdays[6].date() : ''}
              </Text>
            </View>
            {/* View that has a little dot if there is event for that day and changes its color depending on is it clicked or if today is this day*/}
            {isCalendarReady &&
              eventMap.get(weekdays[6].format('DD-MM-YYYY').toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[6])
                      ? [styles.dot, {backgroundColor: 'white'}]
                      : [styles.dot, {backgroundColor: props.themeColor}]
                  }
                />
              )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} style={styles.schedule}>
        {scheduleView !== undefined && scheduleView}
      </ScrollView>
      {/* When isPickerVisible is true then show daeTimePicker as spinner and user can pick a date and it will be show with the week the day is in */}
      {isPickerVisible && (
        <DateTimePicker
          locale={props.locale}
          value={pickerDate.toDate()}
          display="spinner"
          onChange={pickerOnChange}
        />
      )}
      {/* If calendar is not ready or data is loading then show this activity indicator (spinning circle) on full hight and width */}
      {(!isCalendarReady || isLoading) && (
        <ActivityIndicator size="large" color="grey" style={styles.indicator} />
      )}
    </View>
  );
};

WeeklyTraining.propTypes = {
  /** initially selected day */
  selected: PropTypes.any,
  /** If firstDay = 1, week starts from Monday. If firstDay = 7, week starts from Sunday. */
  startWeekday: PropTypes.number,
  /** Set format to display title (e.g. titleFormat='MMM YYYY' displays "Jan 2020") */
  titleFormat: PropTypes.string,
  /** Set format to display weekdays (e.g. weekdayFormat='dd' displays "Mo" and weekdayFormat='ddd' displays "Mon") */
  weekdayFormat: PropTypes.string,
  /** Set locale */
  locale: PropTypes.string,
  /** Set list of events you want to display below weekly calendar.
   * Default is empty array []. */
  events: PropTypes.array,
  /** Specify how each event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderEvent: PropTypes.func,
  /** Specify how first event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderFirstEvent: PropTypes.func,
  /** Specify how last event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderLastEvent: PropTypes.func,
  /** Specify how day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderDay: PropTypes.func,
  /** Specify how first day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderFirstDay: PropTypes.func,
  /** Specify how last day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderLastDay: PropTypes.func,
  /** Handler which gets executed on day press. Default = undefined */
  onDayPress: PropTypes.func,
  /** Set theme color */
  themeColor: PropTypes.string,
  /** Set style of component */
  style: PropTypes.any,
  /** Set text style of calendar title */
  titleStyle: PropTypes.any,
  /** Set text style of weekday labels */
  dayLabelStyle: PropTypes.any,
};

WeeklyTraining.defaultProps = {
  // All props are optional
  selected: moment(),
  startWeekday: 7,
  titleFormat: undefined,
  weekdayFormat: 'ddd',
  locale: 'da',
  events: [],
  renderEvent: undefined,
  renderFirstEvent: undefined,
  renderLastEvent: undefined,
  renderDay: undefined,
  renderFirstDay: undefined,
  renderLastDay: undefined,
  onDayPress: undefined,
  themeColor: '#46c3ad',
  style: {},
  titleStyle: {},
  dayLabelStyle: {},
};

export default WeeklyTraining;

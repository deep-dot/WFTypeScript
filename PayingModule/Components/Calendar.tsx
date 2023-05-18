/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, FC} from 'react';
import {Image, TouchableOpacity, SafeAreaView} from 'react-native';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Assuming that calender.png is in the same directory as this file
const calendarIcon = require('./calender.png');

interface CalendarProps {
  onChange: (date: string) => void;
  OnChange: (day: string) => void;
}

const Calendar: FC<CalendarProps> = ({onChange, OnChange}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const hideDatePicker = () => {
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleConfirm = (date: Date) => {
    onChange(moment(date).format('YYYY/MM/DD'));
    OnChange(daysOfWeek[date.getDay()]);
    setShow(false);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
        }}
        onPress={showDatePicker}>
        <Image source={calendarIcon} style={{width: 45, height: 45}} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

export default Calendar;

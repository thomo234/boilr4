import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditMessages = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    content: '',

    sender: '',

    receiver: '',

    tenant: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { messages } = useAppSelector((state) => state.messages);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { messagesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: messagesId }));
  }, [messagesId]);

  useEffect(() => {
    if (typeof messages === 'object') {
      setInitialValues(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (typeof messages === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = messages[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [messages]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: messagesId, data }));
    await router.push('/messages/messages-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit messages')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit messages'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Content' hasTextareaHeight>
                <Field name='content' as='textarea' placeholder='Content' />
              </FormField>

              <FormField label='Sender' labelFor='sender'>
                <Field
                  name='sender'
                  id='sender'
                  component={SelectField}
                  options={initialValues.sender}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Receiver' labelFor='receiver'>
                <Field
                  name='receiver'
                  id='receiver'
                  component={SelectField}
                  options={initialValues.receiver}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='tenant' labelFor='tenant'>
                <Field
                  name='tenant'
                  id='tenant'
                  component={SelectField}
                  options={initialValues.tenant}
                  itemRef={'tenants'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/messages/messages-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditMessages.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_MESSAGES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditMessages;

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

import { update, fetch } from '../../stores/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditSettings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    dark_mode: false,

    custom_css: '',

    user: '',

    tenant: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { settings } = useAppSelector((state) => state.settings);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { settingsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: settingsId }));
  }, [settingsId]);

  useEffect(() => {
    if (typeof settings === 'object') {
      setInitialValues(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (typeof settings === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = settings[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [settings]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: settingsId, data }));
    await router.push('/settings/settings-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit settings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit settings'}
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
              <FormField label='DarkMode' labelFor='dark_mode'>
                <Field
                  name='dark_mode'
                  id='dark_mode'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='CustomCSS' hasTextareaHeight>
                <Field
                  name='custom_css'
                  as='textarea'
                  placeholder='CustomCSS'
                />
              </FormField>

              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
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
                  onClick={() => router.push('/settings/settings-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_SETTINGS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditSettings;

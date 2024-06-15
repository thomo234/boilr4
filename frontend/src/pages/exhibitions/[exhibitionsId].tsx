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

import { update, fetch } from '../../stores/exhibitions/exhibitionsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditExhibitions = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    gallery: '',

    credits: '',

    profile: '',

    tenant: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { exhibitions } = useAppSelector((state) => state.exhibitions);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { exhibitionsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: exhibitionsId }));
  }, [exhibitionsId]);

  useEffect(() => {
    if (typeof exhibitions === 'object') {
      setInitialValues(exhibitions);
    }
  }, [exhibitions]);

  useEffect(() => {
    if (typeof exhibitions === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = exhibitions[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [exhibitions]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: exhibitionsId, data }));
    await router.push('/exhibitions/exhibitions-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit exhibitions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit exhibitions'}
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
              <FormField label='Title'>
                <Field name='title' placeholder='Title' />
              </FormField>

              <FormField label='Gallery'>
                <Field name='gallery' placeholder='Gallery' />
              </FormField>

              <FormField label='Credits'>
                <Field type='number' name='credits' placeholder='Credits' />
              </FormField>

              <FormField label='Profile' labelFor='profile'>
                <Field
                  name='profile'
                  id='profile'
                  component={SelectField}
                  options={initialValues.profile}
                  itemRef={'profiles'}
                  showField={'name'}
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
                  onClick={() => router.push('/exhibitions/exhibitions-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditExhibitions.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_EXHIBITIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditExhibitions;

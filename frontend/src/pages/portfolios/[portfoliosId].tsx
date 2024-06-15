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

import { update, fetch } from '../../stores/portfolios/portfoliosSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditPortfolios = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    description: '',

    price: '',

    issue_number: '',

    dimensions: '',

    images: [],

    profile: '',

    tenant: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { portfolios } = useAppSelector((state) => state.portfolios);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { portfoliosId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: portfoliosId }));
  }, [portfoliosId]);

  useEffect(() => {
    if (typeof portfolios === 'object') {
      setInitialValues(portfolios);
    }
  }, [portfolios]);

  useEffect(() => {
    if (typeof portfolios === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = portfolios[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [portfolios]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: portfoliosId, data }));
    await router.push('/portfolios/portfolios-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit portfolios')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit portfolios'}
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

              <FormField label='Description' hasTextareaHeight>
                <Field
                  name='description'
                  as='textarea'
                  placeholder='Description'
                />
              </FormField>

              <FormField label='Price'>
                <Field type='number' name='price' placeholder='Price' />
              </FormField>

              <FormField label='IssueNumber'>
                <Field
                  type='number'
                  name='issue_number'
                  placeholder='IssueNumber'
                />
              </FormField>

              <FormField label='Dimensions'>
                <Field name='dimensions' placeholder='Dimensions' />
              </FormField>

              <FormField>
                <Field
                  label='Images'
                  color='info'
                  icon={mdiUpload}
                  path={'portfolios/images'}
                  name='images'
                  id='images'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
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
                  onClick={() => router.push('/portfolios/portfolios-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditPortfolios.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_PORTFOLIOS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditPortfolios;

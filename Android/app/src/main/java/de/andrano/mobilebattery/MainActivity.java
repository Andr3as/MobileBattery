package de.andrano.mobilebattery;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;


public class MainActivity extends Activity {

    private ActionBar actionbar;
    private Activity activity;
    private Context context;

    private Button btn_scan;
    private Button btn_stop;
    private Button btn_activate_wlan;

    public Connection connection;
    private TestClient testClient = null;
    private Wireless wireless;

    public ServiceHandler handler = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.context = getApplicationContext();
        this.activity = this;

        this.wireless = new Wireless(this.context);
        this.handler = new ServiceHandler(this);

        this.actionbar = getActionBar();

        this.actionbar.setDisplayShowHomeEnabled(true);

        btn_scan = (Button) findViewById(R.id.btn_scan);
        btn_scan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivityForResult(new Intent(activity, Barcode.class), 1);
            }
        });

        btn_stop = (Button) findViewById(R.id.btn_stop);
        btn_stop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handler.stopAlarm();
            }
        });

        btn_activate_wlan = (Button) findViewById(R.id.btn_activate_wlan);
        btn_activate_wlan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS));
            }
        });

        findViewById(R.id.progressBar).startAnimation(AnimationUtils.loadAnimation(this, R.anim.rotation));
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (this.wireless.isConnected()) {
            this.actionbar.setTitle(this.wireless.getCurrentSSID());
            this.actionbar.setIcon(R.drawable.ic_wlan);

            btn_scan.setVisibility(View.VISIBLE);
            btn_stop.setVisibility(View.INVISIBLE);
            btn_activate_wlan.setVisibility(View.INVISIBLE);
        } /*else if (this.wireless.isEnabled()) {
            //Connect
        }*/ else {
            //Enable wifi
            this.actionbar.setTitle(R.string.wlan_deactivated);
            this.actionbar.setIcon(R.drawable.ic_no_wlan);

            btn_scan.setVisibility(View.INVISIBLE);
            btn_stop.setVisibility(View.INVISIBLE);
            btn_activate_wlan.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (this.testClient != null) {
            this.testClient.hideLoadingCircle();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (this.handler != null) {
            this.handler.stopAlarm();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            startActivity(new Intent(getApplicationContext(), SettingsActivity.class));
            return true;
        } else if (id == R.id.action_download_app) {
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(getResources().getString(R.string.download_website)));
            startActivity(i);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if(requestCode==1 && data != null)
        {
            String json= data.getStringExtra("BARCODE");

            if (json.equals("NULL")) {
                //that means barcode could not be identified or user pressed the back button
                //do nothing
            } else {
                Log.d(getPackageName(), "QR-Code: " + json);
                try {
                    JSONObject obj = new JSONObject(json);
                    JSONArray ips_a = obj.getJSONArray("ips");
                    String[] ips = new String[ips_a.length()];

                    for (int i = 0; i < ips_a.length(); i++) {
                        ips[i] = ips_a.getString(i);
                        Log.d(getPackageName(), ips[i]);
                    }

                    connection = new Connection(obj);
                    connection.setIps(ips);
                    if (connection.hasError()) {
                        Toast.makeText(getApplicationContext(), R.string.qr_broken, Toast.LENGTH_LONG).show();
                    }
                    this.testClient = new TestClient(connection, this);
                    this.testClient.testAllIps();

                } catch(Exception e) {
                    Log.e(getPackageName(), e.toString());
                }
            }
        }

    }
}
